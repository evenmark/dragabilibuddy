import React from 'react';
import ReactDOM from 'react-dom';

import DragDropBasic from './demos/01_basic';

const DragDropDemo = () => {
  return (
  <div>
    <DragDropBasic />
  </div>);
};

ReactDOM.render(
  <DragDropDemo />,
  document.getElementById('root'),
);
