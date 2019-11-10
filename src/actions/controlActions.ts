import {Cell, Position, GameType, ApplicationState} from '../types';
import {
  FlagCellsAction,
  LoadCellStatesAction,
  LostGameAction,
  OpenCellsAction,
  SelectLevelAction,
  ShouldUpdateMapAction, SolveAutomaticallyAction, WonGameAction
} from '../types/actionTypes';
import {Dispatch} from 'redux';
import getWS from '../services/websocketController';
import {isClosedCell, parseMap} from '../utils';
import {deduce, nextMoves} from '../services/service';

export const loadCellStates = (cells: Cell[][]): LoadCellStatesAction => ({
  type: 'LOAD_CELL_STATES',
  cells
});

export const openCell = (coordinates: Position[]): OpenCellsAction => ({
  type: 'OPEN_CELLS',
  coordinates
});

export const flagCell = (coordinates: Position[]): FlagCellsAction => ({
  type: 'FLAG_CELLS',
  coordinates
});

export const shouldUpdateMap = (): ShouldUpdateMapAction => ({
  type: 'SHOULD_UPDATE_MAP',
});

export const selectLevel = (level: GameType): SelectLevelAction => ({
  type: 'SELECT_LEVEL',
  level
});

export const lostGame = (): LostGameAction => ({
  type: 'LOST_GAME'
});

export const wonGame = (): WonGameAction => ({
  type: 'WON_GAME'
});

export const solveAutomatically = (): SolveAutomaticallyAction => ({
  type: 'SOLVE_AUTOMATICALLY'
});

export async function init(dispatch: Dispatch, state: ApplicationState) {
  const ws = await getWS();
  ws.addMapListener(content => {
    dispatch(loadCellStates(parseMap(content)));
  });

  ws.addLossListener(() => {
    dispatch(lostGame());
  });

  // initialize
  ws.newGame(state.game.level);
  ws.getMap();
}

export const solveNext = ({game}: ApplicationState) => {
  if (game.failed || game.solved) {
    return [];
  }

  const result = nextMoves(game.cells, game.flags) || deduce(game.cells, game.flags);
  if (result != null) {
    return [
      flagCell(result.toFlag),
      openCell(result.toOpen),
      shouldUpdateMap()
    ];
  } else {
    const closedCells = game.cells
      .flatMap(c => c)
      .filter(c => isClosedCell(c.content) && !game.flags[c.y][c.x]);

    const randomCellIndex = Math.floor(Math.random() * closedCells.length);
    return [
      openCell([
        {
          x: closedCells[randomCellIndex].x,
          y: closedCells[randomCellIndex].y
        }
      ]),
      shouldUpdateMap()
    ];
  }
};