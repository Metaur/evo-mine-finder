import React from 'react';
import LevelSelector from '../components/LevelSelector';
import {ApplicationState, Cell, Dispatch, GameType} from '../types';
import MapView from '../components/MapView';
import {connect} from 'react-redux';
import {flagCell, openCell, selectLevel, shouldUpdateMap, solveAutomatically} from '../actions/controlActions';

interface Props {
  cells: Cell[][];
  flags: boolean[][];
  level: GameType;

  selectLevel: (l: GameType) => void;
  openCell: (x: number, y: number) => void;
  shouldUpdateMap: () => void;
  flagCell: (x: number, y: number) => void;

  solveAutomatically: () => void;
}

const App = (props: Props) => {
    return (
      <div className="App">
        <LevelSelector
          selected={props.level}
          onLevelChange={l => props.selectLevel(l)}
        />
        <button
          onClick={() => props.solveAutomatically()}
        >
          Auto-Solve
        </button>
        <MapView
          cells={props.cells}
          flags={props.flags}
          onClick={(x, y) => {
            props.openCell(x, y);
            props.shouldUpdateMap();
          }}
          onRightClick={(x, y) => {
            props.flagCell(x, y);
          }}
        />
      </div>
    );
  }
;

const mapStateToProps = ({game}: ApplicationState) => ({
  cells: game.cells,
  flags: game.flags,
  level: game.level
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectLevel: (l: GameType) => dispatch(selectLevel(l)),
  shouldUpdateMap: () => dispatch(shouldUpdateMap()),
  openCell: (x: number, y: number) => dispatch(openCell([{x, y}])),
  flagCell: (x: number, y: number) => dispatch(flagCell([{x, y}])),
  solveAutomatically: () => dispatch(solveAutomatically())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
