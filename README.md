# Dragabilibuddy

Dragabilibuddy is a simple, lightweight drag and drop library with touch support for React. It has a some basic configurability and features, but with some creativity in your components and styling it can suit quite a few use cases.

## How to use

Implementation is quite simple and minimal styling is applied - you will need to handle the styles and updating of the DOM yourself. Look at the demos for jumping off points.

All you need to do is wrap the area you will be dragging and dropping in with the `Dragabilibuddy` component. Draggables and droppables are wrapped with the `DragBuddy` and `DropBuddy` components respectively and either can be self-closing, or contain children.

```javascript
import React from 'react';
import { Dragabilibuddy, DragBuddy, DropBuddy } from 'dragabilibuddy';

const MyComponent = () => (
  <Dragabilibuddy>
    <h1>My drag and drop life</h1>
    <DragBuddy>
      <p>Draggable item</p>
    </DragBuddy>
    <DropBuddy />
  </Dragabilibuddy>
);

export default MyComponent;
```

### Passing information

In order to identify what was dropped where, the `DragBuddy` component accepts a `dragArgs` prop. Likewise, the `DropBuddy` accepts a `dropArgs` prop and also a callback function as the `onDrop` prop.

When a draggable is succesfully dropped, the `onDrop` callback is called with the `dragArgs` arguments first and the `dropArgs` arguments second.

```javascript
const MyComponent = () => (
  <Dragabilibuddy>
    <h1>My drag and drop life</h1>
    <DragBuddy dragArgs="Drag1">
      Draggable item
    </DragBuddy>
    <DragBuddy dragArgs="Drag2">
      Draggable item
    </DragBuddy>
    <DropBuddy
      onDrop={ (dragArgs, dropArgs) => console.log(`${dragArgs} was dropped onto ${dropArgs}`) }
      dropArgs="Drop1" />
    <DropBuddy
      onDrop={ (dragArgs, dropArgs) => console.log(`${dragArgs} was dropped onto ${dropArgs}`) }
      dropArgs="Drop2" />
  </Dragabilibuddy>
);
```

### Multiple arguments

If either the `dragArgs` or `dropArgs` are arrays, they will be spread.

```javascript
const MyComponent = () => (
  <Dragabilibuddy>
    <h1>My drag and drop life</h1>
    <DragBuddy dragArgs={ ['a', 'b', 'c'] }>
      Draggable item
    </DragBuddy>
    <DropBuddy
      onDrop={ (...args) => console.log(`dragArgs are ${args[0]}, ${args[1]}, ${args[2]}, dropArgs are ${args[3]}, ${args[4]}, ${args[5]}.`) }
      dropArgs={ [1, 2, 3] } />
  </Dragabilibuddy>
);
```

### Restricting draggables to certain droppables

You can control what gets dropped where by passing a `dragId` string prop to a `DragBuddy` component. The `DropBuddy` will recieve a matching `acceptedDragId` prop. The `acceptedDragId` can be a string or an array of strings for multiple accepted.

Droppable regions with no `acceptedDragId` prop will accept all draggables.

```javascript
const MyComponent = () => (
  <Dragabilibuddy>
    <h1>My drag and drop life</h1>
    <DragBuddy dragId="number">1</DragBuddy>
    <DragBuddy dragId="number">2</DragBuddy>
    <DragBuddy dragId="letter">A</DragBuddy>
    <DragBuddy dragId="letter">B</DragBuddy>
    <DropBuddy acceptedDragId="number" />
    <DropBuddy acceptedDragId="letter" />
    <DropBuddy acceptedDragId={ ['number', 'letter'] } />
  </Dragabilibuddy>
);
```

## Styling

### HTML tags

### Classes

## Configuration

## Compatibility

## Demos