import React, { useState } from 'react';

import './style.scss';

const demoNames = ['basic', 'restricted', 'order', 'multiselect'];

const Nav = ({ activeIndex, handleClick }) => (
  <ul className="ddd-nav">
    {demoNames.map((name, i) => (
      <li key={ name }>
        <button
          className={ `ddd-nav__item ${ activeIndex === i ? 'ddd-nav__item--active' : '' }` }
          onClick={ () => handleClick(i) }>
          {name}
        </button>
      </li>
    ))}
  </ul>
);

export default Nav;
