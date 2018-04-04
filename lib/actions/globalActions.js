import * as types from './actionTypes';

export const setProcessing = (processing) => {
  return { type: types.SET_PROCESSING, processing };
};

export const setView = (view) => {
  return { type: types.SET_VIEW, view };
};
