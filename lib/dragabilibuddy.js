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
}) => {
  const TagType = tagType;
  const cloneEl = useRef(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [pointer, setPointer] = useState({ x: null, y: null });
  const [drag, setDrag] = useState(initialDragState);
  const pointerRef = useRef(pointer);
  const dragRef = useRef(drag);
  let cloneAnim = {};

  function startDrag(node = null, x = 0, y = 0, dragArgs = null, dragId = null) {
    setDrag({ node, x: pointer.x - x, y: pointer.y - y, dragArgs, dragId });
    dragRef.current = { x: pointer.x - x, y: pointer.y - y, originalX: x, originalY: y };
  }

  function stopDrag(shouldCancel = true) {
    setIsPointerDown(false);
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

  function handlePointerDown() {
    if (!drag.node) setIsPointerDown(true);
  }

  function handlePointerMove(e) {
    const newState = { x: e.clientX, y: e.clientY };
    setPointer(newState);
    pointerRef.current = newState;
  }

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
              pointerEvents: 'none',
            } }>
            {dragElement || drag.node}
          </div>}
      </TagType>
    </DbdyContext.Provider>
  );
};

Dragabilibuddy.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf({}),
  ]),
  tagType: PropTypes.string,
  className: PropTypes.string,
  cloneClass: PropTypes.string,
  dragStartDistance: PropTypes.number,
  cancelReturnDuration: PropTypes.number,
  returnOnCancel: PropTypes.bool,
  dragElement: PropTypes.shape({}),
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
};

export default Dragabilibuddy;
