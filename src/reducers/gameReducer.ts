import {ApplicationAction, GameState} from '../types';

const initialState: GameState = {
  cells: [],
  flags: [],
  level: 1,
  failed: false,
  solved: false,
  autoSolve: false
};

export default (state: GameState = initialState, action: ApplicationAction) => {
  switch (action.type) {
    case 'LOAD_CELL_STATES':
      return {
        ...state,
        cells: action.cells,
        flags: state.flags.length !== action.cells.length ?
          action.cells.map(row => new Array(row.length).fill(false)) :
          state.flags
      };
    case 'SELECT_LEVEL':
      return {
        ...initialState,
        level: action.level,
        shouldUpdateMap: true
      };
    case 'FLAG_CELLS': {
      const flags = [...state.flags];
      action.coordinates.forEach(({x, y}) => flags[y][x] = true);
      return {
        ...state,
        flags
      };
    }
    case 'WON_GAME':
      return {
        ...state,
        solved: true,
        autoSolve: false
      };
    case 'LOST_GAME':
      return {
        ...state,
        failed: true,
        autoSolve: false
      };
      case 'SOLVE_AUTOMATICALLY':
        return {
          ...state,
          autoSolve: true
        };
    default:
      return state;
  }
};