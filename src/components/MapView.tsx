import React from 'react';
import {isEqual} from 'lodash';
import {Cell} from '../types';
import {isClosedCell, isEmptyCell} from '../utils';

interface Props {
  cells: Cell[][];
  flags: boolean[][];
  onClick: (x: number, y: number) => void;
  onRightClick: (x: number, y: number) => void;
}

interface CellProps {
  flagged: boolean;
  cell: Cell;
  key: string;
  onClick: () => void;
  onRightClick: () => void;
}

const colors: {
  [x: string]: string
} = {
  '1': 'blue',
  '2': 'green',
  '3': 'red',
  '4': 'brown',
  '5': 'black',
  '*': 'red'
};

class CellView extends React.Component<CellProps> {

  shouldComponentUpdate(nextProps: Readonly<CellProps>): boolean {
    return !isEqual(this.props.cell, nextProps.cell) || this.props.flagged !== nextProps.flagged;
  }

  render() {
    let content = ' ';

    if (this.props.flagged) {
      content = 'F';
    } else if (isEmptyCell(this.props.cell.content) || isClosedCell(this.props.cell.content)) {
      content = ' ';
    } else {
      content = this.props.cell.content;
    }

    return (
      <button
        key={this.props.key}
        style={{
          minWidth: '35px',
          height: '35px',
          width: '35px',
          color: this.props.flagged ? 'red' : colors[this.props.cell.content] || 'yellow',
          backgroundColor: isClosedCell(this.props.cell.content) ? 'grey' : undefined,
          margin: '1px'
        }}
        disabled={!isClosedCell(this.props.cell.content)}
        onClick={() => this.props.onClick()}
        onContextMenu={(e) => {
          e.preventDefault();
          this.props.onRightClick();
        }}
      >
        {content}
      </button>
    )
  }
}

export default (props: Props) => {
  return (
    <>
      {
        props.cells.map((row, i) => (
          <div key={`row-${i}`} style={{
            display: 'flex'
          }}>
            {row.map((cell, j) => (
              <CellView
                key={`cell-${j}`}
                flagged={props.flags[cell.y][cell.x]}
                cell={cell}
                onClick={() => props.onClick(j, i)}
                onRightClick={() => props.onRightClick(j, i)}
              />
            ))}
          </div>
        ))
      }
    </>
  );
};