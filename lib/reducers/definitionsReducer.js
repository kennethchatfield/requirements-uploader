import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function definitions(state = initialState.definitions, action) {
  switch (action.type) {
    case types.SET_DEFINITIONS:
      let rules = {},
        conditions = {};
      const all = action.definitions||[];
      all.map(definition=>{
        if(definition.rule) rules[definition.id] = definition;
        if(definition.condition) conditions[definition.id] = definition;
      });
      return Object.assign({}, state, { all, rules, conditions });
    default:
      return state;
  }
}
