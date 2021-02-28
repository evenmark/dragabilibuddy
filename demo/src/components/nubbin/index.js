import React, { useState } from 'react';

import './style.scss';

const Nubbin = ({ children, clickable }) => {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    if (clickable) setIsActive(!isActive);
  }

  return (
    <div
      className={ `nubbin ${isActive ? 'nubbin--active' : ''}` }
      tabIndex="0"
      role="button"
      onClick={ handleClick }
      onKeyPress={ handleClick }>
      {children}
    </div>
  );
};

export default Nubbin;
