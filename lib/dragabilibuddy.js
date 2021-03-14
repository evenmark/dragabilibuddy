import React, { createContext, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DRAG_START_DISTANCE = 10;
const CANCEL_RETURN_DURATION = 300;
const initialDragState = { node: null, x: 0, y: 0, dragArgs: null, dragId: null };
export const DbdyContext = createContext();

const Dragabilibuddy = ({
  children,
  tagType,
  className,
  cloneClass,
  dragStartDistance,
  cancelReturnDuration,
  returnOnCancel,
  dragElement,
  dynamicDropSize,
}) => {
  const TagType = tagType;
  const cloneEl = useRef(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [pointer, setPointer] = useState({ x: null, y: null, type: null });
  const [drag, setDrag] = useState(initialDragState);
  const pointerRef = useRef(pointer);
  const dragRef = useRef(drag);
  const isPointerDownRef = useRef(isPointerDown);
  let cloneAnim = {};

  // Start drag, add it to state
  function startDrag(node = null, x = 0, y = 0, dragArgs = null, dragId = null) {
    setDrag({ node, x: pointer.x - x, y: pointer.y - y, dragArgs, dragId });
    dragRef.current = { x: pointer.x - x, y: pointer.y - y, originalX: x, originalY: y };
  }

  // Stop drag, clear state but also animate the cloned element if cancelled
  function stopDrag(shouldCancel = true) {
    setIsPointerDown(false);
    isPointerDownRef.current = false;
    if (cloneAnim.playState === 'running') return;
    if (shouldCancel && returnOnCancel && cloneEl && cloneEl.current) {
      cloneAnim = cloneEl.current.animate([
        {
          top: `${pointerRef.current.y - dragRef.current.y}px`,
          left: `${pointerRef.current.x - dragRef.current.x}px`,
        },
        {
          top: `${dragRef.current.originalY}px`,
          left: `${dragRef.current.originalX}px`,
        },
      ], {
        duration: cancelReturnDuration,
        easing: 'ease-out',
      });
      cloneAnim.onfinish = () => setDrag(initialDragState);
    } else {
      setDrag(initialDragState);
    }
  }

  // Set pointer down if there is no dragging node (allows new drag to be started)
  function handlePointerDown() {
    if (drag.node) return;
    setIsPointerDown(true);
    isPointerDownRef.current = true;
  }

  // Record pointer position if the mouse is down
  function handlePointerMove(e) {
    if (!isPointerDownRef.current) return;
    const newState = { x: e.clientX, y: e.clientY, type: e.pointerType };
    setPointer(newState);
    pointerRef.current = newState;
  }

  // Listeners for move and pointerup on window (in case user drags outside component)
  useEffect(() => {
    if (typeof window === 'undefined') return null;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopDrag);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopDrag);
    };
  }, []);

  return (
    <DbdyContext.Provider value={ {
      isPointerDown,
      pointer,
      drag,
      startDrag,
      stopDrag,
      dragStartDistance,
      dynamicDropSize,
    } }>
      <TagType
        className={ className }
        onPointerDown={ handlePointerDown }>
        {children}
        {drag.node &&
          <div
            ref={ cloneEl }
            className={ cloneClass }
            style={ {
              top: `${dragElement ? pointer.y : pointer.y - drag.y}px`,
              left: `${dragElement ? pointer.x : pointer.x - drag.x}px`,
              position: 'fixed',
              height: 'auto',
              width: 'auto',
            } }>
            {dragElement || drag.node}
          </div>}
      </TagType>
    </DbdyContext.Provider>
  );
};

Dragabilibuddy.propTypes = {
  children: PropTypes.any,
  tagType: PropTypes.string,
  className: PropTypes.string,
  cloneClass: PropTypes.string,
  dragStartDistance: PropTypes.number,
  cancelReturnDuration: PropTypes.number,
  returnOnCancel: PropTypes.bool,
  dragElement: PropTypes.shape({}),
  dynamicDropSize: PropTypes.bool,
};

Dragabilibuddy.defaultProps = {
  children: [],
  tagType: 'div',
  className: 'dbdy',
  cloneClass: 'dbdy__clone',
  dragStartDistance: DRAG_START_DISTANCE,
  cancelReturnDuration: CANCEL_RETURN_DURATION,
  returnOnCancel: true,
  dragElement: null,
  dynamicDropSize: false,
};

export default Dragabilibuddy;
