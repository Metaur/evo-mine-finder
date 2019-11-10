import {Epic, ofType} from 'redux-observable';
import {ApplicationAction, Cell} from '../types';
import {filter, mergeMap, tap, withLatestFrom} from 'rxjs/operators';
import getWS from '../services/websocketController';
import {OpenCellsAction, SelectLevelAction} from '../types/actionTypes';
import {EMPTY} from 'rxjs';
import {shouldUpdateMap, solveNext, wonGame} from '../actions/controlActions';
import {isClosedCell} from '../utils';

export const levelEpic: Epic = action$ => action$.pipe(
  ofType<ApplicationAction, SelectLevelAction>('SELECT_LEVEL'),
  mergeMap(action =>
    getWS()
      .then(ws => ws.newGame(action.level)).then(() => shouldUpdateMap()))
);

export const loadMap: Epic = action$ => action$.pipe(
  ofType('SHOULD_UPDATE_MAP'),
  mergeMap(_ => {
    getWS().then(ws => ws.getMap());
    return EMPTY;
  })
);

export const openCellsEpic: Epic = action$ => action$.pipe(
  ofType<ApplicationAction, OpenCellsAction>('OPEN_CELLS'),
  mergeMap(action => {
    getWS()
      .then(ws =>
        action.coordinates.forEach(c => ws.open(c.x, c.y)));
    return EMPTY;
  })
);

export const autoSolveEpic: Epic = (action$, state$) => action$.pipe(
  ofType('SOLVE_AUTOMATICALLY', 'LOAD_CELL_STATES'),
  tap((action) => console.log(action)),
  withLatestFrom(state$),
  filter(([_, state]) => state.game.autoSolve && !(state.game.solved || state.game.failed)),
  tap(([_, state]) => console.log(state)),
  mergeMap(([_, state]) => {
    const allOpen = state.game.cells
      .flatMap((c: Cell[]) => c)
      .find((c: Cell) => isClosedCell(c.content)) == null;

    if (allOpen) {
      return [wonGame()];
    }

    return solveNext(state)
  })
);

