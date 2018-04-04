import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function database(state = initialState.database, action) {
  switch (action.type) {
    case types.SET_DATA:
      return Object.assign({}, state, { data: action.data });
    case types.SET_TABLE_NAME:{
      const { tableName } = action;
      return Object.assign({}, state, { tableName });
    }
    case types.SET_CREATED_AHJS:{
      const { createdAhjs } = action;
      return Object.assign({}, state, { createdAhjs: [ ...createdAhjs ] });
    }
    case types.SET_EXISTING_AHJS:{
      const { existingAhjs } = action;
      return Object.assign({}, state, { existingAhjs });
    }
    case types.DELETE_RULE:{
      const { ids, ruleId } = action;
      console.log('DELETE_RULE', { ids, ruleId });
      let createdAhjs = [];
      state.existingAhjs.map( ahj => {
        if( ids.includes(ahj.id) && ahj.rules && ahj.rules[ruleId] ) createdAhjs.push(
          Object.assign({}, ahj, {
            rules: Object.assign({},
              ...Object.keys(ahj.rules).map(id=>{
                if( id !== ruleId ) return { [ id ]: ahj.rules[ id ] }
              })
            )
          })
        )
      });
      return Object.assign({}, state, { createdAhjs });
    }
    case types.SET_VALIDATION_CHECK:{
      const { ids, ruleId } = action;
      return Object.assign({}, state, {
        validation: Object.assign({}, initialState.database.validation, {
          check:{
            ids,
            ruleId
          }
        } )
      });
    }
    case types.SET_VALIDATION_RESULTS:{
      const { results } = action;
      return Object.assign({}, state, {
        validation: Object.assign({}, state.validation, { results } )
      });
    }
    default:
      return state;
  }
}
