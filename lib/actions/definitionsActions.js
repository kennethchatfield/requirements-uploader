import * as types from './actionTypes';
import DynamobdApi from '../api/DynamobdApi';
import config from '../../config';

export const setDefinitions = (definitions) => {
  return { type: types.SET_DEFINITIONS, definitions };
};


export const getDefinitions = (env) => {
  return (dispatch) => {
    if(env) DynamobdApi.scan(config[env].tables.definitions).then(definitions=>{
      dispatch(setDefinitions(definitions));
    });
  }

}
