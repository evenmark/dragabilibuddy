import React, { useState } from 'react';

import { Dragabilibuddy, DragBuddy, DropBuddy } from '../../../../lib';
import Nubbin from '../../components/nubbin';
import './style.scss';

const DragDropBasic = () => {
  const [nubbinsOut, setNubbinsOut] = useState([0, 1, 2, 3, 4, 5]);
  const [nubbinsIn, setNubbinsIn] = useState([]);

  function handleDrop(dragArgs) {
    setNubbinsOut(nubbinsOut.filter((nubbin) => nubbin !== dragArgs));
    if (!nubbinsIn.includes(dragArgs)) setNubbinsIn([...nubbinsIn, dragArgs]);
  }

  return (
    <div className="ddd__basic">
      <Dragabilibuddy>
        <div>
          {nubbinsOut.map((nubbin) => (
            <DragBuddy dragArgs={ nubbin }>
              <Nubbin>Drag {nubbin + 1}</Nubbin>
            </DragBuddy>
          ))}
        </div>
        <div>
          <DropBuddy
            onDrop={ handleDrop }>
            <span>Drop</span>
            {nubbinsIn.map((nubbin) => (
              <Nubbin>Drag {nubbin + 1}</Nubbin>
            ))}
          </DropBuddy>
        </div>
      </Dragabilibuddy>
    </div>
  );
};

export default DragDropBasic;
