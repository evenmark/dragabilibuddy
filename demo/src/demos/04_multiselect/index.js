import React, { useState } from 'react';

import { Dragabilibuddy, DragBuddy, DropBuddy } from '../../../../lib';
import Nubbin from '../../components/nubbin';
import './style.scss';

const DragDropMultiselect = () => {
  const [nubbinsOut, setNubbinsOut] = useState([0, 1, 2, 3, 4, 5]);
  const [nubbinsIn, setNubbinsIn] = useState([]);
  const [nubbinsActive, setNubbinsActive] = useState([]);

  function handleDrop() {
    const newOutState = nubbinsOut.slice(0);
    const newInState = nubbinsIn.slice(0);
    
    nubbinsActive.forEach((nubbin) => {
      const existingIndex = newOutState.indexOf(nubbin);
      if (existingIndex >= 0) newOutState.splice(existingIndex, 1);
      if (!newInState.includes(nubbin)) newInState.push(nubbin);
    });

    setNubbinsOut(newOutState);
    setNubbinsIn(newInState);
    setNubbinsActive([]);
  }

  function handleClick(nubbin) {
    const newState = nubbinsActive.slice(0);
    const existingIndex = nubbinsActive.indexOf(nubbin);
    if (existingIndex >= 0) {
      newState.splice(existingIndex, 1);
    } else {
      newState.push(nubbin);
    }
    setNubbinsActive(newState);
  }

  return (
    <div className="ddd__multiselect">
      <Dragabilibuddy dragElement={ <span className="dbdy__drag-el">{nubbinsActive.length}</span> }>
        <div>
          {nubbinsOut.map((nubbin) => {
            const isActive = nubbinsActive.includes(nubbin);
            const Elem = isActive ? DragBuddy : 'div';
            return (
              <Elem dragArgs={ nubbin }>
                <Nubbin
                  selectable={ true }
                  isActive={ isActive }
                  handleClick={ () => handleClick(nubbin) }>
                  Drag {nubbin + 1}
                </Nubbin>
              </Elem>
            )
          })}
        </div>
        <div>
          <DropBuddy
            onDrop={ handleDrop }>
            <span>Drop</span>
            {nubbinsIn.map((nubbin) => (
              <Nubbin selectable={ true }>Drag {nubbin + 1}</Nubbin>
            ))}
          </DropBuddy>
        </div>
      </Dragabilibuddy>
    </div>
  );
};

export default DragDropMultiselect;
