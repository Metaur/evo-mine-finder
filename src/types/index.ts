import {ActionType} from './actionTypes';
import {Dispatch} from 'redux';
import {ThunkDispatch} from 'redux-thunk';

export type GameType = 1 | 2 | 3 | 4;

export interface Cell extends Position {
  content: string;
}
export interface CellWithConstraint extends Cell {
  constraint: Constraint;
}

export class Constraint {
  possibleBombPlacements: Position[] = [];
  bombCount: number;

  constructor(bombCount: number) {
    this.bombCount = bombCount;
  }

  findIndex(coordinate: Position): number {
    return this.possibleBombPlacements.findIndex(({x, y}) => coordinate.x === x && coordinate.y === y)
  }

  addPossiblePlacements(coordinate: Position) {
    if (this.findIndex(coordinate) === -1) {
      this.possibleBombPlacements.push(coordinate);
    }
  }

  removePossiblePlacement(coordinate: Position) {
    const index = this.findIndex(coordinate);
    if (index !== -1) {
      delete this.possibleBombPlacements[index];
    }
  }

  suitsConstraint(cWithBomb: Position[]): boolean {
    const matchesFound = cWithBomb.filter(c => this.findIndex({
      x: c.x,
      y: c.y
    }) !== -1);

    return matchesFound.length === this.bombCount;
  }
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  cells: Cell[][];
  flags: boolean[][];
  solved: boolean;
  failed: boolean;
  level: GameType;
  autoSolve: boolean;
}

export interface ApplicationState {
  game: GameState;
}

export type ApplicationAction = ActionType;

export type Dispatch = ThunkDispatch<ApplicationState, void, ApplicationAction>