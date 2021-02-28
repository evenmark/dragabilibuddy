import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Nav from './components/nav';
import DragDropBasic from './demos/01_basic';
import DragDropRestricted from './demos/02_restricted';
import DragDropOrder from './demos/03_order';
import DragDropMultiselect from './demos/04_multiselect';
import './style.scss';

const DragDropDemo = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  return (
    <div className="ddd">
      <Nav activeIndex={ activeDemo } handleClick={ setActiveDemo } />
      {activeDemo === 0 && <DragDropBasic />}
      {activeDemo === 1 && <DragDropRestricted />}
      {activeDemo === 2 && <DragDropOrder />}
      {activeDemo === 3 && <DragDropMultiselect />}
    </div>
  );
};

ReactDOM.render(
  <DragDropDemo />,
  document.getElementById('root'),
);
