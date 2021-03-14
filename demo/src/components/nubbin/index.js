import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Nubbin = ({ children, selectable, isActive, handleClick }) => {
  return (
    <div
      className={ `nubbin ${selectable ? 'nubbin--selectable' : ''} ${isActive ? 'nubbin--active' : ''}` }
      tabIndex="0"
      role="button"
      onClick={ handleClick }
      onKeyPress={ handleClick }>
      {children}
    </div>
  );
};

Nubbin.propTypes = {
  children: PropTypes.any,
  selectable: PropTypes.bool,
  isActive: PropTypes.bool,
  handleClick: PropTypes.func,
};

Nubbin.defaultProps = {
  children: [],
  selectable: false,
  isActive: false,
  handleClick: () => {},
};

export default Nubbin;
