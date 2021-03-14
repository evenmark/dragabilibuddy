import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import { Dragabilibuddy, DragBuddy } from '../';

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

beforeEach(() => {
  HTMLElement.prototype.animate = animateMock;
});

afterEach(() => {
  HTMLElement.prototype.animate = originalAnimate;
});

describe('Dragabilibuddy', () => {
  describe('Container', () => {
    test('Should render container with correct tag', () => {
      const { container, rerender } = render(<Dragabilibuddy />);

      expect(container.querySelectorAll('div.dbdy')).toHaveLength(1);
      expect(container.querySelectorAll('span.dbdy')).toHaveLength(0);

      rerender(<Dragabilibuddy tagType="span" />);

      expect(container.querySelectorAll('div.dbdy')).toHaveLength(0);
      expect(container.querySelectorAll('span.dbdy')).toHaveLength(1);
    });
    test('Should render container with correct class', () => {
      const testClass = 'testClass';
      const { container } = render(<Dragabilibuddy className={ testClass } />);

      expect(container.querySelectorAll(`div.${testClass}`)).toHaveLength(1);
    });
  });
  describe('Start drag', () => {
    test('Should start drag and render clone when dragging', async () => {
      const testClass = 'testClass';
      const { container } = render(
        <Dragabilibuddy>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);

      await act(async () => {
        await fireEvent.pointerDown(dragEl);
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(1);
    });
    test('Should start drag and render drag clone with correct class', async () => {
      const testClass = 'testClass';
      const testCloneClass = 'testCloneClass';
      const { container } = render(
        <Dragabilibuddy cloneClass={ testCloneClass }>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 

      await act(async () => {
        await fireEvent.pointerDown(dragEl);
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.${testCloneClass} .${testClass}`)).toHaveLength(1);
    });
    test('Should start drag and render custom drag node when dragging', async () => {
      const testClass = 'testClass';
      const testCustomClass = 'testCustomClass';
      const { container } = render(
        <Dragabilibuddy dragElement={ <span className={ testCustomClass } /> }>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 

      await act(async () => {
        await fireEvent.pointerDown(dragEl);
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);
      expect(container.querySelectorAll(`.dbdy__clone .${testCustomClass}`)).toHaveLength(1);
    });
    test('Should not start new drag if drag already in progress', async () => {
      const testClass = 'testClass';
      const testClassAlt = 'testClassAlt';
      const { container } = render(
        <Dragabilibuddy>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
          <DragBuddy>
            <p className={ testClassAlt }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 
      const dragElAlt = container.querySelector(`.${testClassAlt}`); 

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);

      await act(async () => {
        await fireEvent.pointerDown(dragEl);
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(1);

      await act(async () => {
        await fireEvent.pointerDown(dragElAlt);
        await fireEvent.pointerMove(dragElAlt, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragElAlt, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClassAlt}`)).toHaveLength(0);
    });
    test('Should not start drag is pointer is up', async () => {
      const testClass = 'testClass';
      const { container } = render(
        <Dragabilibuddy>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);

      await act(async () => {
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);
    });
  });
  describe('Stop drag', () => {
    test('Should stop drag with animation if drag cancelled', async () => {
      const testClass = 'testClass';
      const { container } = render(
        <Dragabilibuddy>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 

      await act(async () => {
        await fireEvent.pointerDown(dragEl);
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(1);

      await act(async () => {
        await fireEvent.pointerUp(dragEl);
      });

      expect(animateMock).toHaveBeenCalled();

      await waitFor(() => {
        expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);
      });
    });
    test('Should stop drag with no animation if returnOnCancel is false', async () => {
      const testClass = 'testClass';
      const { container } = render(
        <Dragabilibuddy returnOnCancel={ false }>
          <DragBuddy>
            <p className={ testClass }>dummyDrag</p>
          </DragBuddy>
        </Dragabilibuddy>
      );
      const dragEl = container.querySelector(`.${testClass}`); 

      await act(async () => {
        await fireEvent.pointerDown(dragEl);
        await fireEvent.pointerMove(dragEl, { clientX: 0, clientY: 0 });
        await fireEvent.pointerMove(dragEl, { clientX: 20, clientY: 20 });
      });

      expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(1);

      await act(async () => {
        await fireEvent.pointerUp(dragEl);
      });

      expect(animateMock).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(container.querySelectorAll(`.dbdy__clone .${testClass}`)).toHaveLength(0);
      });
    });
  });
});
