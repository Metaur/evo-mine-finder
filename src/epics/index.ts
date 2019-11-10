import {combineEpics} from 'redux-observable';
import * as ep from './gameEpics';

export default combineEpics(
  ep.loadMap,
  ep.levelEpic,
  ep.openCellsEpic,
  ep.autoSolveEpic
);