import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { Dragabilibuddy, DragBuddy, DropBuddy } from '../';

const originalAnimate = HTMLElement.prototype.animate;
const animateMock = jest.fn(() => {
  const returnObj = { onfinish: null, playState: 'running' };
  let pollInterval;

  pollInterval = setInterval(() => {
    if (typeof returnObj.onfinish === 'function') {
      returnObj.onfinish();
      returnObj.playState = null;
      clearInterval(pollInterval);
    }
  }, 10);

  return returnObj;
});
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
const getBoundingClientRectMock = jest.fn(() => ({ x: 80, y: 80, width: 80, height: 80 }));

beforeEach(() => {
  HTMLElement.prototype.animate = animateMock;
  HTMLElement.prototype.getBoundingClientRect = getBoundingClientRectMock;
});

afterEach(() => {
  HTMLElement.prototype.animate = originalAnimate;
  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});

describe('DropBuddy', () => {
  test('Should show active class if valid drop zone', async () => {
    const testClass1 = 'testClass1';
    const testClass2 = 'testClass2';
      const { container } = render(
        <Dragabilibuddy>
          <DragBuddy dragId="1">
            <p className={ testClass1 }>dummyDrag</p>
          </DragBuddy>
          <DragBuddy dragId="2">
            <p className={ testClass2 }>dummyDrag</p>
          </DragBuddy>
          <DropBuddy className="drop1" acceptedDragId="1" />
          <DropBuddy className="drop2" acceptedDragId="2" />
        </Dragabilibuddy>
      );
      const dragEl1 = container.querySelector(`.${testClass1}`);
      const dragEl2 = container.querySelector(`.${testClass2}`);

      expect(container.querySelectorAll('.drop1.dbdy-drop--active')).toHaveLength(0);
      expect(container.querySelectorAll('.drop2.dbdy-drop--active')).toHaveLength(0);

      await act(async () => {
        await fireEvent.pointerDown(dragEl1);
        await fireEvent.pointerMove(dragEl1, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl1, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll('.drop1.dbdy-drop--active')).toHaveLength(1);
      expect(container.querySelectorAll('.drop2.dbdy-drop--active')).toHaveLength(0);
  });
  test('Should show hover and active classes if hovering over valid drop zone', async () => {
    const testClass = 'testClass';
    const { container } = render(
      <Dragabilibuddy>
        <DragBuddy>
          <p className={ testClass }>dummyDrag</p>
        </DragBuddy>
        <DropBuddy />
      </Dragabilibuddy>
    );
    const dragEl = container.querySelector(`.${testClass}`);

    expect(container.querySelectorAll('.dbdy-drop--active')).toHaveLength(0);

    await act(async () => {
      await fireEvent.pointerDown(dragEl);
      await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
      await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
    });

    expect(container.querySelectorAll('.dbdy-drop--active')).toHaveLength(1);
    expect(container.querySelectorAll('.dbdy-drop--active.dbdy-drop--hover')).toHaveLength(0);

    await act(async () => {
      await fireEvent.pointerMove(dragEl, { clientX: 85, clientY: 85 });
    });

    expect(container.querySelectorAll('.dbdy-drop--active.dbdy-drop--hover')).toHaveLength(1);
  });
  test('Should stop drag if drop success', async () => {
    const testClass = 'testClass';
    const { container } = render(
      <Dragabilibuddy>
        <DragBuddy>
          <p className={ testClass }>dummyDrag</p>
        </DragBuddy>
        <DropBuddy />
      </Dragabilibuddy>
    );
    const dragEl = container.querySelector(`.${testClass}`);

    expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);

    await act(async () => {
      await fireEvent.pointerDown(dragEl);
      await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
      await fireEvent.pointerMove(dragEl, { clientX: 85, clientY: 85 });
    });

    expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(1);

    await act(async () => {
      await fireEvent.pointerUp(dragEl);
    });

    await waitFor(() => {
      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);
    });
  });
  test('Should call onDrop with args from DragBuddy and DropBuddy', async () => {
    const testClass = 'testClass';
    const dragArgs = 'dragArgs';
    const dropArgs = 'dropArgs';
    const dummyDrop = jest.fn();
    const { container } = render(
      <Dragabilibuddy>
        <DragBuddy dragArgs={ dragArgs }>
          <p className={ testClass }>dummyDrag</p>
        </DragBuddy>
        <DropBuddy onDrop={ dummyDrop } dropArgs={ dropArgs } />
      </Dragabilibuddy>
    );
    const dragEl = container.querySelector(`.${testClass}`);

    await act(async () => {
      await fireEvent.pointerDown(dragEl);
      await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
      await fireEvent.pointerMove(dragEl, { clientX: 85, clientY: 85 });
      await fireEvent.pointerUp(dragEl);
    });

    expect(dummyDrop).toHaveBeenCalledWith(dragArgs, dropArgs);
  });
  test('Should call onDrop with array args spread from DragBuddy and DropBuddy', async () => {
    const testClass = 'testClass';
    const dragArgs = ['dragArgs2', 'dragArgs2'];
    const dropArgs = ['dropArgs1', 'dropArgs2'];
    const dummyDrop = jest.fn();
    const { container } = render(
      <Dragabilibuddy>
        <DragBuddy dragArgs={ dragArgs }>
          <p className={ testClass }>dummyDrag</p>
        </DragBuddy>
        <DropBuddy onDrop={ dummyDrop } dropArgs={ dropArgs } />
      </Dragabilibuddy>
    );
    const dragEl = container.querySelector(`.${testClass}`);

    await act(async () => {
      await fireEvent.pointerDown(dragEl);
      await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
      await fireEvent.pointerMove(dragEl, { clientX: 85, clientY: 85 });
      await fireEvent.pointerUp(dragEl);
    });

    expect(dummyDrop).toHaveBeenCalledWith(dragArgs[0], dragArgs[1], dropArgs[0], dropArgs[1]);
  });
});