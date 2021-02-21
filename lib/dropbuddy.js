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
  const [isHover, setIsHover] = useState(false);
  const { isPointerDown, pointer, drag, stopDrag } = useContext(DbdyContext);
  const isActive = (drag.node && isPointerDown) && (
    !acceptedDragId ||
    (Array.isArray(acceptedDragId) && acceptedDragId.includes(drag.dragId)) ||
    acceptedDragId === drag.dragId
  );
  const wasActiveDuringDrag = useRef(isActive);

  function isIntersecting() {
    const { x, y, width, height } = dropEl.current.getBoundingClientRect();
    return pointer.x >= x && pointer.x <= (x + width) && pointer.y >= y && pointer.y <= (y + height);
  }

  useEffect(() => {
    if (isActive) {
      wasActiveDuringDrag.current = true;
    } else if (isHover) {
      setIsHover(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isPointerDown && wasActiveDuringDrag.current) {
      if (isIntersecting()) {
        stopDrag(false);

        if (!onDrop || typeof onDrop !== 'function') return;

        // Only spread args if in an array
        onDrop(
          ...(Array.isArray(drag.dragArgs) ? drag.dragArgs : [drag.dragArgs]),
          ...(Array.isArray(dropArgs) ? dropArgs : [dropArgs]),
        );
      }

      wasActiveDuringDrag.current = false;
    }
  }, [isPointerDown]);

  useEffect(() => {
    if (isActive) setIsHover(isIntersecting());
  }, [pointer, isActive]);

  return (
    <TagType
      ref={ dropEl }
      className={ `${className} ${isActive ? activeClass : ''}  ${isHover ? hoverClass : ''}` }>
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
  className: 'dbdy__drop',
  activeClass: 'dbdy__drop--active',
  hoverClass: 'dbdy__drop--hover',
  acceptedDragId: null,
  onDrop: null,
  dropArgs: null,
};

export default DropBuddy;
