import { combineReducers } from 'redux';
import database from './databaseReducer';
import environment from './environmentReducer';
import global from './globalReducer';
import definitions from './definitionsReducer';

const rootReducer = combineReducers({
  database,
  environment,
  global,
  definitions
});

export default rootReducer;
