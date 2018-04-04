import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function database(state = initialState.global, action) {
  switch (action.type) {
    case types.SET_VIEW:
      const { view } = action;
      return Object.assign({}, state, { view });
    case types.SET_PROCESSING:
      const { processing } = action;
      return Object.assign({}, state, { processing });
    default:
      return state;
  }
}
