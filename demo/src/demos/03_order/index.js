import React, { useState } from 'react';

import { Dragabilibuddy, DragBuddy, DropBuddy } from '../../../../lib';
import Nubbin from '../../components/nubbin';
import './style.scss';

const DragDropOrder = () => {
  const [nubbins, setNubbins] = useState([1, 2, 3, 4, 5, 6]);

  function handleDrop(dragArgs, dropArgs) {
    const currentIndex = nubbins.findIndex((nubbin) => nubbin === dragArgs);
    const newIndex = currentIndex < dropArgs ? dropArgs - 1 : dropArgs;

    if (currentIndex !== newIndex) {
      const newState = nubbins.slice(0);
      newState.splice(currentIndex, 1);
      newState.splice(newIndex, 0, dragArgs);
      setNubbins(newState);
    }
  }

  return (
    <div className="ddd__order">
      <Dragabilibuddy>
        <DropBuddy
          dropArgs={ 0 }
          onDrop={ handleDrop } />
        {nubbins.map((nubbin, i) => (
          <>
            <DragBuddy
              key={ `drag_${nubbin}` }
              dragArgs={ nubbin }>
              <Nubbin>Drag {nubbin}</Nubbin>
            </DragBuddy>
            <DropBuddy
              key={ `drop_${nubbin}` }
              dropArgs={ i + 1 }
              onDrop={ handleDrop } />
          </>
        ))}
      </Dragabilibuddy>
    </div>
  );
};

export default DragDropOrder;
