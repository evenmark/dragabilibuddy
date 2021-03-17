# Dragabilibuddy

[![npm version](https://badge.fury.io/js/dragabilibuddy.svg)](https://badge.fury.io/js/dragabilibuddy)

Dragabilibuddy is a simple, lightweight drag and drop library with touch support for React. It has a some basic configurability and features, but with some creativity in your components and styling it can suit quite a few use cases.

As the focus of this library was simplicity I recommend just forking it or copying the code to your own repository to add and remove features as you see fit, rather than consuming the library from NPM (which you could also do if you prefer).

- [Dragabilibuddy](#dragabilibuddy)
  * [Demos](#demos)
  * [Configurable features](#configurable-features)
  * [How to use](#how-to-use)
    + [Passing information](#passing-information)
    + [Multiple arguments](#multiple-arguments)
    + [Restricting draggables to certain droppables](#restricting-draggables-to-certain-droppables)
  * [Styling](#styling)
    + [HTML tags](#html-tags)
    + [Classes](#classes)
  * [Compatibility and Caveats](#compatibility-and-caveats)

## Demos

1. [Basic](//evenmark.github.io/dragabilibuddy/demo/#0) - A basic drag and drop. Rendering of elements is handled in local state outside the Dragabilibuddy.
2. [Restricted](//evenmark.github.io/dragabilibuddy/demo/#1) - Drag elements are restricted to certain drop zones. Rendering of elements is handled in local state outside the Dragabilibuddy.
3. [Order](//evenmark.github.io/dragabilibuddy/demo/#2) - Changing order of items in a list. Rendering of elements is handled in local state, a drop zone is positioned in between each drag item. Hover class is used to change the dimensions, margings and z-index in order to show items moving to accomodate the dragged item.
4. [Multiselect](//evenmark.github.io/dragabilibuddy/demo/#3) - Click on each item to select them for drag. This is maintained in local state outside of Dragabilibuddy. Makes use of custom drag element.

## Configurable features

You can pass props to the `Dragabilibuddy` wrapper component to adjust a few simple things.

- `dragStartDistance` - When starting drag, pointer must move this distance before drag is initiated. This prevent accidental drags on interactive drag items. Accepts and integer. Defaults to `10`. 
- `cancelReturnDuration` - When drag is cancelled, the cloned element moves back to its point of origin. Accepts and integer (ms). Defaults to `300`.
- `returnOnCancel` - When drag is cancelled, the cloned element moves back to its point of origin unless this prop is set to `false`. Defaults to `true`.
- `dragElement` - When dragging, a clone of the dragged element follows the pointer, unless you pass a node/component to render, which will follow the pointer instead. Pass `[]` so nothing follows the pointer. Defaults to `null` (a clone will follow).
- `dynamicDropSize` - When starting drag, the dimensions of the drop zones are measured once. If these drop zones change dimensions in styling (e.g. when hovering, active or are animated), set this to `true` to take continuous measurements. Defaults to `false`.

```javascript
import React from 'react';
import { Dragabilibuddy, DragBuddy, DropBuddy } from 'dragabilibuddy';

const MyComponent = () => (
  <Dragabilibuddy
    dragStartDistance={ 20 }
    cancelReturnDuration={ 100 }
    returnOnCancel={ false }
    dragElement={ <p>Hi there!</p> }
    dynamicDropSize={ true }>
    {/* Children go here... */}
  </Dragabilibuddy>
);

export default MyComponent;
```

## How to use

Implementation is quite simple and minimal styling is applied - you will need to handle the styles and updating of the DOM yourself. Look at the demos for jumping off points.

All you need to do is wrap the area you will be dragging and dropping in with the `Dragabilibuddy` component. Draggables and droppables are wrapped with the `DragBuddy` and `DropBuddy` components respectively and either can be self-closing, or contain children.

```javascript
const MyComponent = () => (
  <Dragabilibuddy>
    <h1>My drag and drop life</h1>
    <DragBuddy>
      <p>Draggable item</p>
    </DragBuddy>
    <DropBuddy />
  </Dragabilibuddy>
);
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

Dragabilibuddy was designed to be very relaxed in its enforcement of styling. The only style are applied inline to the cloned drag element. Each of the wrapper components will augment the DOM - they wrap their children in an element container (default `div`) and use overrideable classes for styling.

### HTML tags

`Dragabilibuddy`, `DragBuddy` and `DropBuddy` will all leave an element in the DOM (self-closing or wrapping their children). This is a `div` by default, but you can override these tags by providing the string prop `tagType` to any of the components.

```javascript
const MyComponent = () => (
  <Dragabilibuddy>
    <DragBuddy tagType="li">Drag me</DragBuddy>
    <DropBuddy tagType="ul" />
  </Dragabilibuddy>
);
```

### Classes

The components use default classes which you can target for styling on your own, or you can override any of the default classes to match your own naming conventions.

- `Dragabilibuddy`
  - `dbdy` - the class on the surrounding `Dragabilibuddy` wrapper. Overridden by passing the string prop `className`.
  - `dbdy__clone` - the class on the cloned element that follows the pointer during dragging. Overridden by passing the string prop `cloneClass`.
- `DragBuddy`
  - `dbdy-drag` - the class on the surrounding `DragBuddy` wrapper. Overridden by passing the string prop `className`.
  - `dbdy-drag--dragging` - the class on the original dragged element during drag. Overridden by passing the string prop `draggingClass`.
- `DropBuddy`
  - `dbdy-drop` - the class on the surrounding `DropBuddy` wrapper. Overridden by passing the string prop `className`.
  - `dbdy-drop--active` - the class on the `DropBuddy` during drag if the drop zone is viable. Overridden by passing the strong prop `activeClass`.
  - `dbdy-drop--hover` - the class on the `DropBuddy` during drag if the drop zone is viable and is hovered over. Overridden by passing the strong prop `hoverClass`.

```javascript
const MyComponent = () => (
  <Dragabilibuddy
    className="hello"
    cloneClass="hello__clone">
    <DragBuddy
      className="hello__drag"
      draggingClass="hello__drag--dragoon">
      Drag me
    </DragBuddy>
    <DropBuddy
      className="hello__drop"
      activeClass="active"
      hoverClass="glow" />
  </Dragabilibuddy>
);
```

## Compatibility and Caveats

I have not thoroughly tested this library. Assume compatibility with only the latest webkit and chromium based browsers. Testing has been completed with:

- iOS and iPadOS 11.4
- Chrome 86
- Firefox 86

Other caveats and limitations include:

- Only once instance of `Dragabilibuddy` is possible
- `DropBuddy` can contain instances of `DragBuddy`, do not go crazy with nesting
- Dragging near the edge of the screen does not trigger auto-scrolling
- All wrapper components leave a DOM element wrapper around their children
