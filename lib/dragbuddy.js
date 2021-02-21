import React, { useRef, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DbdyContext } from './dragabilibuddy';

const DragBuddy = ({
  children,
  tagType,
  className,
  draggingClass,
  dragId,
  dragArgs,
}) => {
  const TagType = tagType;
  const dragEl = useRef(null);
  const initialMousePos = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { isPointerDown, drag, startDrag, dragStartDistance } = useContext(DbdyContext);

  function handlePointerMove(e) {
    if (isPointerDown && !drag.node) {
      initialMousePos.current = initialMousePos.current || { x: e.clientX, y: e.clientY };
      const biggestDifference = Math.max(
        Math.abs(e.clientX - initialMousePos.current.x),
        Math.abs(e.clientY - initialMousePos.current.y),
      );
      if (biggestDifference >= dragStartDistance) {
        const { x, y } = dragEl.current.getBoundingClientRect();
        startDrag(<>{children}</>, x, y, dragArgs, dragId);
        setIsDragging(true);
        initialMousePos.current = null;
      }
    }
  }

  useEffect(() => {
    if (!isPointerDown && isDragging) setIsDragging(false);
  }, [isPointerDown]);

  useEffect(() => {
    const el = dragEl.current;
    const listener = (e) => e.preventDefault();
    el.addEventListener('touchmove', listener, { passive: false });
    return () => el.removeEventListener('touchmove', listener, { passive: false });
  }, []);

  return (
    <TagType
      ref={ dragEl }
      className={ `${className} ${isDragging ? draggingClass : ''}` }
      onPointerMove={ handlePointerMove }>
      {children}
    </TagType>
  );
};

DragBuddy.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf({}),
  ]),
  tagType: PropTypes.string,
  className: PropTypes.string,
  draggingClass: PropTypes.string,
  dragId: PropTypes.string,
  dragArgs: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

DragBuddy.defaultProps = {
  children: [],
  tagType: 'div',
  className: 'dbdy__drag',
  draggingClass: 'dbdy__drag--dragging',
  dragId: null,
  dragArgs: null,
};

export default DragBuddy;
