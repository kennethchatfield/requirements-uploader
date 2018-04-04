
import { isUnique, pickMetaData, findItem, writeToCollection } from '../utilities/utilities';
import * as types from './actionTypes';
import { setProcessing } from './globalActions'
import DynamobdApi from '../api/DynamobdApi';
import config from '../../config';
import { filterCollection } from '../utilities/utilities'




export const setCreatedAhjs = (createdAhjs) => {
  return { type: types.SET_CREATED_AHJS, createdAhjs };
};

export const setExistingAhjs = (existingAhjs) => {
  return { type: types.SET_EXISTING_AHJS, existingAhjs };
};

export const applyMetaData = (dataCollection) => {
  return (dispatch, getState) => {
    const { existingAhjs, createdAhjs } = getState().database;

    const createdMap = Object.assign({},
      ...createdAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );
    const existingMap = Object.assign({},
      ...existingAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );
    let newCreatedAhjs = {};
    dataCollection.map(item=>{
      const metaData = pickMetaData(item);
      const { id } = metaData;
      if(!id || (metaData.id&&Object.keys(metaData).length===1)) return false;
      const existingAhj = newCreatedAhjs[id] || createdMap[id] || existingMap[id];
      if(existingAhj){
        newCreatedAhjs[id] = Object.assign({},
          existingAhj,
          metaData
        )
      }
    });
    dispatch(setCreatedAhjs(writeToCollection(createdAhjs,Object.values(newCreatedAhjs))));
  }
};

export const applyRules = (ahjRuleCollection) => {
  return (dispatch, getState) => {
    const { existingAhjs, createdAhjs } = getState().database;

    const createdMap = Object.assign({},
      ...createdAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );
    const existingMap = Object.assign({},
      ...existingAhjs.map(ahj=>{return{[ahj.id]:ahj}})
    );

    let newCreatedAhjs = {};
    ahjRuleCollection.map(ahjRule=>{
      const { id, rules, inherit } = ahjRule;
      const existingAhj = newCreatedAhjs[id] || createdMap[id] || existingMap[id];
      if( existingAhj ) {
        // if(existingAhj.inherit) {
        //   return newCreatedAhjs[id] = existingAhj;
        // }
        return newCreatedAhjs[id] = Object.assign({},
          existingAhj,
          inherit ? { inherit } :
          {
            rules: Object.assign({},
              existingAhj.rules,
              rules
            )
          }
        )
      }
    });
    dispatch(setCreatedAhjs(writeToCollection(createdAhjs,Object.values(newCreatedAhjs))));
  };
};



export const deleteItems = (key,value) => {
  return (dispatch, getState) => {

    const { tableName, existingAhjs } = getState().database;
    if(!tableName||existingAhjs.length===0) return null;
    const ahjs = ( !key || !value ) ? existingAhjs : filterCollection(existingAhjs, key,value);

    dispatch(setProcessing('Deleting Items...'));

    console.log('::::::ahjs been filtered:::::::\n', ahjs );

    DynamobdApi.deleteMultiple(ahjs,tableName).then(()=>{
      dispatch(setProcessing(null));
      dispatch(setExistingAhjs([]));
    })
  }
};

export const createAhjs = (results) => {
  return (dispatch, getState) => {
    const { existingAhjs, createdAhjs } = getState().database;
    const existing = [ ...existingAhjs, ...createdAhjs ];
    const uniqueAhjs = results.filter(result=>{
      const { name, type, id } = result;
      return !result.error && isUnique(result,existing,{id})
    }).map(item=>{
      return pickMetaData(item, true);
    });
    dispatch(setCreatedAhjs([...createdAhjs,...uniqueAhjs]));
  }
};

export const setTableName = (tableName) => {
  return { type: types.SET_TABLE_NAME, tableName };
};

export const loadTable = () => {
  return (dispatch, getState) => {
    const { tableName } = getState().database;
    if( tableName ) {
      dispatch(setProcessing('Loading Table Data...'));
      DynamobdApi.scan(tableName).then(Items=>{
        dispatch(setProcessing(null));
        dispatch(setExistingAhjs(Items));
      });
    }
  }
};


export const uploadItems = (query) => {
  return (dispatch, getState) => {
    const { database, environment } = getState();
    const { tableName } = database;
    const createdAhjs = ( !query ) ? database.createdAhjs : filterCollection(database.createdAhjs, query);
    dispatch(setProcessing(`Uploading Items, Item Count:: ${createdAhjs.length}`));
    DynamobdApi.putAll(createdAhjs,config[environment.active].tables.ahj)
      .then((data)=>{
        dispatch(setProcessing(null));
        console.log('batch data:::::\n',data);
      })
  }
};

export const loadExistingAhjs = () => {
  return (dispatch, getState) => {
    const { active } = getState().environment;
    dispatch(setProcessing(`Loading Data From: ${config[active].tables.ahj}`));
    DynamobdApi.scan(config[active].tables.ahj).then(ahjs=>{
      dispatch(setProcessing(null));
      dispatch(setExistingAhjs(ahjs))
    })
  }
};


export const mergeTables = (query) => {

}

export const getAhjs = ( ids ) => {
  return (dispatch, getState) => {
    const TableName = getState().database.tableName;
    const params = ids.map( id => {
      return { TableName, id }
    });
    console.log('about to get::params::',params);
    DynamobdApi.getAhjs( params ).then( ahjs => {
      dispatch( setExistingAhjs(ahjs) );
    })
  }
};

const cutRule = (rules,cuteId) => {
  console.log('cuteId',cuteId);
  return Object.assign({},
    ...Object.keys(rules).map( ruleId => {
      if( cuteId !== ruleId ) return { [ruleId]: rules[ruleId] }
    })
  );
};

const pasteRule = (ahj,paste) => {
  if( paste ) return Object.assign({},
    ahj,
    {
      rules: Object.assign({},
        ahj.rules,
        paste
      )
    }
  );
};

export const cutAndPastRule = ( cutAndPaste ) => {
  return (dispatch, getState) => {
    const { from, rule, to } = cutAndPaste;
    let existingAhjs = JSON.parse(
      JSON.stringify( getState().database.existingAhjs )
    );
    let paste;
    existingAhjs = existingAhjs.map( ahj => {
      if( ahj.id !== from ) return ahj;
      paste = {[rule]:ahj.rules[rule]};
      return Object.assign({},ahj,{
        rules: cutRule(ahj.rules,rule)
      })
    });
    console.log('paste::::',paste);
    const pasted = existingAhjs.map( ahj => {
      if( ahj.id === to )  return pasteRule( ahj, paste );
      return ahj;
    });
    console.log('pasted:::',pasted);
    dispatch(setCreatedAhjs(pasted));
  }
};


export const cutAndPastRules = (cuts) => {
  return (dispatch) => {
    cuts.map( cutAndPaste => {
      dispatch( cutAndPastRule( cutAndPaste ) );
    })
  }
};

export const ruleDelete = (ids,ruleId) => {
  return { type: types.DELETE_RULE, ids, ruleId };
};


export const check = (ids,ruleId) => {
  return { type: types.SET_VALIDATION_CHECK, ids, ruleId };
}

export const setValidationResults = (results) => {
  return { type: types.SET_VALIDATION_RESULTS, results };
}


const isContainedInList = (ahj,ids,type) => {
  if(ids) return ids.includes(ahj.id);
  if(type) return ahj.type === type;
};

export const ruleExistence = (ids,ruleId,type) => {
  return (dispatch, getState) => {
    const { existingAhjs } = getState().database;
    dispatch( check( ids, ruleId ) );
    let validate = {found:[],notFound:[],invalidExistence:[]};
    let ahjsWithType = [];
    existingAhjs.map( ahj => {
      const containedInList = isContainedInList(ahj,ids,type);
      if( containedInList && ahj.rules && ahj.rules[ ruleId ]) validate.found.push(ahj.id);
      if(!containedInList && ahj.rules && ahj.rules[ ruleId ]) validate.invalidExistence.push(ahj.id);
      if(type&&ahj.type===type) ahjsWithType.push(ahj);
    });
    if(ids) ids.map( id => {
      if(!validate.found.includes(id)) validate.notFound.push(id);
    });
    if( type ) ahjsWithType.map(ahj=>{
      if(!validate.found.includes(ahj.id)) validate.notFound.push(ahj.id);
    });
    console.log('validate:::::::::::::::\n',validate);
    dispatch(setValidationResults(validate))
  }
};
