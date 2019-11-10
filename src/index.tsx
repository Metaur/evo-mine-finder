import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createEpicMiddleware} from 'redux-observable';

import App from './pages/App';
import rootReducer from './reducers';
import rootEpic from './epics';
import {init} from './actions/controlActions';
import './index.css';

const epicMiddleware = createEpicMiddleware();

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, epicMiddleware)));

epicMiddleware.run(rootEpic);
init(store.dispatch, store.getState());

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById('root'));
