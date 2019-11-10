import {Cell} from './types';

export function getFlags(cells: Cell[][]) {
  return cells.map(row => new Array(row.length).fill(false))
}