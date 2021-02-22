import React from 'react';

import Nubbin from '../../components/nubbin';
import { Dragabilibuddy, DragBuddy, DropBuddy } from '../../../../lib';

import '../../style.scss';

const DragDropBasic = () => {
  const data = [
    {
      name: 'numbers',
      acceptedDragId: 'n',
      nubbins: [
        {
          value: 1,
          dragId: 'n',
        },
        {
          value: 2,
          dragId: 'n',
        },
      ],
    },
    {
      name: 'letters & numbers',
      acceptedDragId: ['l', 'n'],
      nubbins: [
        {
          value: 3,
          dragId: 'n',
        },
        {
          value: 'A',
          dragId: 'l',
        },
      ],
    },
    {
      name: 'letters',
      acceptedDragId: 'l',
      nubbins: [
        {
          value: 'B',
          dragId: 'l',
        },
        {
          value: 'C',
          dragId: 'l',
        },
      ],
    },
  ];

  return (
    <Dragabilibuddy>
      <div className="ddd-container">
        {data.map((item) => (
          <DropBuddy
            key={ item.name }
            className="ddd-section"
            activeClass="ddd-section--active"
            hoverClass="ddd-section--hover"
            acceptedDragId={ item.acceptedDragId }
            dropArgs={ item.name }
            onDrop={ (dragArgs, dropArgs) => { console.log(`'${dragArgs}' dropped onto '${dropArgs}'`); } }>
            <span className="ddd-title">{item.name}</span>
            {item.nubbins.map((nubbin) => (
              <DragBuddy
                key={ nubbin.value }
                dragArgs={ nubbin.value }
                dragId={ nubbin.dragId }>
                <Nubbin>{nubbin.value}</Nubbin>
              </DragBuddy>
            ))}
          </DropBuddy>
        ))}
      </div>
    </Dragabilibuddy>
  );
};

export default DragDropBasic;
