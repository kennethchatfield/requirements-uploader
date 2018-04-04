import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function environment(state = initialState.environment, action) {
  switch (action.type) {
    case types.SET_ACTIVE_ENVIRONMENT:
      return Object.assign({}, state, { active: action.env });
    default:
      return state;
  }
}
