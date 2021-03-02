import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const demoNames = ['basic', 'restricted', 'order', 'multiselect'];

const Nav = ({ activeIndex, handleClick }) => (
  <ul className="ddd-nav">
    {demoNames.map((name, i) => (
      <li key={ name }>
        <button
          className={ `ddd-nav__item ${ activeIndex === i ? 'ddd-nav__item--active' : '' }` }
          onClick={ () => {
            window.location.hash = i;
            handleClick(i);
          } }>
          {name}
        </button>
      </li>
    ))}
  </ul>
);

Nav.propTypes = {
  activeIndex: PropTypes.number,
  handleClick: PropTypes.func,
};

Nav.defaultProps = {
  activeIndex: [],
  handleClick: () => {},
};

export default Nav;
