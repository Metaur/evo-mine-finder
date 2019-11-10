import React from 'react';
import {GameType} from '../types';

type Props = {
  selected: GameType;
  onLevelChange: (level: GameType) => void
};

const levels: GameType[] = [1, 2, 3, 4];

export default (props: Props) => {
  return (
    <>
      {
        levels.map(i => (
          <button
            key={`level-btn-${i}`}
            disabled={i === props.selected}
            onClick={() => props.onLevelChange(i)}
          >
            Level {i}
          </button>
        ))
      }
    </>
  )
};
