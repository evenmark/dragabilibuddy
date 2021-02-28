import React, { useState } from 'react';

import { Dragabilibuddy, DragBuddy, DropBuddy } from '../../../../lib';
import Nubbin from '../../components/nubbin';
import './style.scss';

const TYPE_LETTER = 'letters';
const TYPE_NUMBER_LETTER = 'numbers & letters';
const TYPE_NUMBER = 'numbers';

const DragDropRestricted = () => {
  const [letters, setLetters] = useState([
    { value: 'a', type: TYPE_LETTER },
    { value: 'b', type: TYPE_LETTER },
  ]);
  const [lettersAndNumbers, setLettersAndNumbers] = useState([
    { value: 'c', type: TYPE_LETTER },
    { value: 1, type: TYPE_NUMBER },
  ]);
  const [numbers, setNumbers] = useState([
    { value: 2, type: TYPE_NUMBER },
    { value: 3, type: TYPE_NUMBER },
  ]);

  function handleDrop(dragArgs, dropArgs) {
    const dragItemIsInLetters = letters.find((item) => item.value === dragArgs.value);
    const dragItemIsInNumbers = numbers.find((item) => item.value === dragArgs.value);
    const dragItemIsInLettersNumbers = lettersAndNumbers.find((item) => item.value === dragArgs.value);
  
    if (dragItemIsInLetters && dropArgs !== TYPE_LETTER) {
      setLetters(letters.filter((item) => item.value !== dragArgs.value));
    } else if (dragItemIsInNumbers && dropArgs !== TYPE_NUMBER) {
      setNumbers(numbers.filter((item) => item.value !== dragArgs.value));
    } else if (dragItemIsInLettersNumbers && dropArgs !== TYPE_NUMBER_LETTER) {
      setLettersAndNumbers(lettersAndNumbers.filter((item) => item.value !== dragArgs.value));
    }

    if (dropArgs === TYPE_LETTER) {
      if (!dragItemIsInLetters) setLetters([...letters, dragArgs]);
    } else if (dropArgs === TYPE_NUMBER) {
      if (!dragItemIsInNumbers) setNumbers([...numbers, dragArgs]);
    } else if (dropArgs === TYPE_NUMBER_LETTER) {
      if (!dragItemIsInLettersNumbers) setLettersAndNumbers([...lettersAndNumbers, dragArgs]);
    }
  }

  return (
    <div className="ddd__restricted">
      <Dragabilibuddy>
        <DropBuddy
          acceptedDragId={ TYPE_LETTER }
          dropArgs={ TYPE_LETTER }
          onDrop={ handleDrop }>
          <span>{TYPE_LETTER}</span>
          {letters.map((letter) => (
            <DragBuddy
              key={ letter.value }
              dragArgs={ letter }
              dragId={ letter.type }>
              <Nubbin>Drag {letter.value}</Nubbin>
            </DragBuddy>
          ))}
        </DropBuddy>
        <DropBuddy
          acceptedDragId={ [TYPE_LETTER, TYPE_NUMBER] }
          dropArgs={ TYPE_NUMBER_LETTER }
          onDrop={ handleDrop }>
          <span>{TYPE_NUMBER_LETTER}</span>
          {lettersAndNumbers.map((letterOrNumber) => (
            <DragBuddy
              key={ letterOrNumber.value }
              dragArgs={ letterOrNumber }
              dragId={ letterOrNumber.type }>
              <Nubbin>Drag {letterOrNumber.value}</Nubbin>
            </DragBuddy>
          ))}
        </DropBuddy>
        <DropBuddy
          acceptedDragId={ TYPE_NUMBER }
          dropArgs={ TYPE_NUMBER }
          onDrop={ handleDrop }>
          <span>{TYPE_NUMBER}</span>
          {numbers.map((number) => (
            <DragBuddy
              key={ number.value }
              dragArgs={ number }
              dragId={ number.type }>
              <Nubbin>Drag {number.value}</Nubbin>
            </DragBuddy>
          ))}
        </DropBuddy>
      </Dragabilibuddy>
    </div>
  );
};

export default DragDropRestricted;
