import React, { useRef, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DbdyContext } from './dragabilibuddy';

const DropBuddy = ({
  children,
  tagType,
  className,
  activeClass,
  hoverClass,
  acceptedDragId,
  onDrop,
  dropArgs,
}) => {
  const TagType = tagType;
  const dropEl = useRef(null);
  const wasActiveDuringDrag = useRef(isActive);
  const rect = useRef({});
  const [isHover, setIsHover] = useState(false);
  const { isPointerDown, pointer, drag, stopDrag, dynamicDropSize } = useContext(DbdyContext);
  const isActive = (drag.node && isPointerDown) && (
    !acceptedDragId ||
    (Array.isArray(acceptedDragId) && acceptedDragId.includes(drag.dragId)) ||
    acceptedDragId === drag.dragId
  );

  // Is pointer intersecting this drop zone
  function isIntersecting() {
    // Get cached rect is drop zone is static (dimensions, position)
    const { x, y, width, height } = dynamicDropSize ?
      dropEl.current.getBoundingClientRect() : rect.current;
    return pointer.x >= x && pointer.x <= (x + width) && pointer.y >= y && pointer.y <= (y + height);
  }

  // Finish drag process and run drop callback
  function handleDrop() {
    stopDrag(false);

    if (!onDrop || typeof onDrop !== 'function') return;

    // Only spread args if in an array, passing drag args first, then drop args
    onDrop(
      ...(Array.isArray(drag.dragArgs) ? drag.dragArgs : [drag.dragArgs]),
      ...(Array.isArray(dropArgs) ? dropArgs : [dropArgs]),
    );
  }

  // When drop zone active state changes...
  useEffect(() => {
    if (isActive) {
      // Make a note that this drop zone was active
      wasActiveDuringDrag.current = true;
    } else {
      // Remove hover state when drop zone is no longer active
      setIsHover(false);
    }
  }, [isActive]);

  // On pointer down/up...
  useEffect(() => {
    if (isPointerDown && !dynamicDropSize) {
      // Record drop zone dimensions on pointer down
      rect.current = dropEl.current.getBoundingClientRect();
    } else if (!isPointerDown && wasActiveDuringDrag.current) {
      // If pointer is released on this zone and is was active, complete drop
      if (isIntersecting()) handleDrop();
      wasActiveDuringDrag.current = false;
    }
  }, [isPointerDown]);

  // Set hover set when intersect with active drop zone
  useEffect(() => {
    if (isActive) setIsHover(isIntersecting());
  }, [pointer, isActive]);

  return (
    <TagType
      ref={ dropEl }
      className={ `${className} ${isActive ? activeClass : ''}  ${isActive && isHover ? hoverClass : ''}` }>
      {children}
    </TagType>
  );
};

DropBuddy.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.arrayOf({}),
  ]),
  tagType: PropTypes.string,
  className: PropTypes.string,
  activeClass: PropTypes.string,
  hoverClass: PropTypes.string,
  acceptedDragId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onDrop: PropTypes.func,
  dropArgs: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

DropBuddy.defaultProps = {
  children: [],
  tagType: 'div',
  className: 'dbdy-drop',
  activeClass: 'dbdy-drop--active',
  hoverClass: 'dbdy-drop--hover',
  acceptedDragId: null,
  onDrop: null,
  dropArgs: null,
};

export default DropBuddy;
