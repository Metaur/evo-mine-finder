import {combineReducers} from 'redux';
import gameReducer from './gameReducer';
import {ApplicationState} from '../types';

export default combineReducers<ApplicationState>({
  game: gameReducer
});