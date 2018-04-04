import * as types from './actionTypes';
import { getDefinitions } from './definitionsActions'

export const activeEnvironmentSet = (env) => {
  return { type: types.SET_ACTIVE_ENVIRONMENT, env };
};

export const setActiveEnvironment = (env) => {
  return (dispatch) => {
    dispatch(getDefinitions(env));
    dispatch(activeEnvironmentSet(env));
  }
};
