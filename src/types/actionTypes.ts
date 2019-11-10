import {Cell, Position, GameType} from './index';

export interface LoadCellStatesAction {
  type: 'LOAD_CELL_STATES';
  cells: Cell[][];
}

export interface OpenCellsAction {
  type: 'OPEN_CELLS';
  coordinates: Position[];
}

export interface FlagCellsAction {
  type: 'FLAG_CELLS';
  coordinates: Position[];
}

export interface ShouldUpdateMapAction {
  type: 'SHOULD_UPDATE_MAP';
}

export interface SelectLevelAction {
  type: 'SELECT_LEVEL';
  level: GameType;
}

export interface LostGameAction {
  type: 'LOST_GAME';
}

export interface WonGameAction {
  type: 'WON_GAME';
}

export interface SolveAutomaticallyAction {
  type: 'SOLVE_AUTOMATICALLY'
}

export type ActionType =
  LoadCellStatesAction |
  OpenCellsAction |
  FlagCellsAction |
  ShouldUpdateMapAction |
  SelectLevelAction |
  LostGameAction |
  WonGameAction |
  SolveAutomaticallyAction
  ;

