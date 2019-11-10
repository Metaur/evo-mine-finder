import {Cell, Position, Constraint} from './types';

export function getNeighbourCells(cells: Cell[][], cell: Position): Cell[] {
  const maxY = cells.length - 1;
  const maxX = cells[0].length - 1;

  return [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ]
    .map(([y, x]) => [cell.y + y, cell.x + x])
    .filter(([y, x]) => y >= 0 && y <= maxY && x >= 0 && x <= maxX)
    .map(([y, x]) => cells[y][x])
    .filter(cell => cell);
}

export function isBombCell(content: string) {
  return content === '*';
}

export function isClosedCell(content: string) {
  return content === '□';
}

export function isEmptyCell(content: string) {
  return content === '0';
}

export function buildCellConstraint(cells: Cell[][], flags: boolean[][], c: Cell) {
  if (isClosedCell(c.content) || isEmptyCell(c.content)) {
    return null;
  }

  const cellsAround = getNeighbourCells(cells, c).filter(c => isClosedCell(c.content));
  const nonFlagged = cellsAround.filter(c => !flags[c.y][c.x]);
  const constraint = new Constraint(Number(c.content) - (cellsAround.length - nonFlagged.length));
  nonFlagged
    .forEach(c => constraint.addPossiblePlacements({
      x: c.x,
      y: c.y
    }));

  return constraint;
}

export function parseMap(content: string): Cell[][] {
  return content
    .split('\n')
    .slice(1, -1)
    .map(row => row.split(''))
    .map((row, y) => row.map((cell, x) => ({
      x, y, content: cell
    })));
}

export function getOpenBorderCells(cells: Cell[][]) {
  return cells.reduce((acc, row, y) =>
      acc.concat(row.filter((cell, x) =>
        !isClosedCell(cell.content) &&
        !isEmptyCell(cell.content) &&
        getNeighbourCells(cells, {x, y}).filter(c => isClosedCell(c.content)).length > 0))
    , []);
}
