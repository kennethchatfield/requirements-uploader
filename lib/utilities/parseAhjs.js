import info from './info';

const { metaDataFields, descriptionsMap } = info;

let collection,
  definitions;

const modifyCollection = (collection) => {
  let newItems = [];
  return [...collection.map(item=>{
    if( item.name.indexOf(',') > 0 &&( item.type === 'Office' || item.type === "ROC")) {
      let items = item.id.split(',').map(id=>{
        return Object.assign({},item,{id})
      });
      item = items.shift();
      newItems = [ ...newItems, ...items]
    }
    return item;
  }), ...newItems];
};

const initialize = (params) => {
  collection = modifyCollection(JSON.parse(JSON.stringify(params.collection)));
  definitions = JSON.parse(JSON.stringify(params.definitions));
  console.log('definitions\n',definitions);
};

const isConditionId = (conditionId) => {
  return Object.keys(definitions.conditions).includes(conditionId);
};

const isValueHeader = (header) => {
  return (
    !metaDataFields.includes(header) &&
    ( isConditionId(header.split(':')[0]) ||
    header === 'default' )
  );
};

const conditionAllowed = (conditionId, ruleDefinition) => {
  const currCondDef = definitions.conditions[conditionId];
  const foundInAllowableConditions = () =>{
    if( ruleDefinition.allowableConditions !== "none" &&
      ruleDefinition.allowableConditions.includes(conditionId) ){
      return true;
    }
    return console.error("allowableConditions:::Condition Not Allowed in Rule conditionId:",conditionId, "rileId:",ruleDefinition.id);
  };
  const appliesTo = () => {
    if( currCondDef.applyTo &&
      currCondDef.applyTo.includes(ruleDefinition.id)) {
      return true;
    }
    return console.error("applyTo:::Rule Does Not Allow condition rileId:",ruleDefinition.id, "conditionId:",conditionId);
  };
  return foundInAllowableConditions() && appliesTo();
};

const validateValueDefinition = (value,definition) => {
  const itemsMap = definition.template.itemsMap || Object.assign(
      ...definition.template.items.map(item=>{
        return {[item.id]:item}
      })
    );
  if(!definition.template.itemsMap) definition.template.itemsMap = itemsMap;
  const validation = value.split(',').map(item => {
    if(!Object.keys(itemsMap).includes(item)) console.log(item);
    return Object.keys(itemsMap).includes(item);
  });
  return !validation.includes(false)
};


const parseVal = (val, definition) => {
  const { dataType } = definition.template;
  if( dataType === 'object' ){
    try{ return JSON.parse(val).value; }
    catch (e) { console.log('val',val); }
  }
  if( dataType === 'collection' ){
    try { return JSON.parse(val) }
    catch (e) { console.log('val',val); }
  }
  if( dataType === 'ordered list' ) {
    if(validateValueDefinition(val, definition)) return val.split(',');
    return console.error('Error, value not found in definition');
  }
  if( dataType === 'enum' ) {
    if(validateValueDefinition(val, definition)) return val;
    return console.error('Error, value not found in definition', definition.id, val);
  }
  if( dataType === 'boolean' ) {
    if(val.toLowerCase() === 'true') return true;
    else if(val.toLowerCase() === 'false') return false;
  }
  if( dataType === 'number' ){
    if(val.indexOf('.')>0) return parseFloat(val);
    else return parseInt(val);
  }
  if( dataType === 'string' ){
    return val;
  }
  if( dataType === 'link' ){
    return val;
  }
};

const parseDesc = (key,val,definition) => {
  if(key==='default'||val==="")return null;
  let description;
  const { dataType } = definition.template;
  if( dataType === 'object' ){
    description = JSON.parse(val).description;
  }
  if(!description && descriptionsMap[key]) description = descriptionsMap[key];
  return description;

};

const inheritance = (ahjData) => {
  const headers = Object.keys(ahjData);
  if(headers.includes('inherit')){
    return {
      source: JSON.parse(ahjData.inherit)
    }
  }
};


const buildAhj = (ahjData) => {
  let Errors = [];

  let valueHeaders = Object.keys(ahjData).filter(isValueHeader);

  const inherit = inheritance(ahjData);

  const ruleDefinition = definitions.rules[ahjData.ruleId];

  const buildRules = () => {

    const buildStatement = (conditionsString, value, statement = {}) => {
      let conditionFoundInValue;
      const buildConditions = () => {
        return conditionsString.split(',').map(conditionString=>{
          const conditionArray = conditionString.split(':');
          if( conditionArray.length < 3 && value.includes(':') ) {
            conditionFoundInValue = true;
            conditionArray.push(value.split(':')[0]);
          }
          const conditionDefinition = definitions.conditions[conditionArray[0]];
          // console.log('conditionDefinition::::\n',conditionDefinition);
          if(!conditionAllowed(conditionArray[0],ruleDefinition)) return ;
          console.log('conditionArray',conditionArray);
          return {
            left:conditionArray[0],
            operator:conditionArray[1],
            right:parseVal(conditionArray[2],conditionDefinition)
          }
        })
      };

      if(conditionsString!=='default'){
        statement.condition = buildConditions()
      }
      if(descriptionMap[conditionsString]){
        statement.description = descriptionMap[conditionsString];
      }
      value = !conditionFoundInValue ? value : value.split(':').pop();
      return Object.assign(statement,{
        value: parseVal(value, ruleDefinition)
      })
    };

    const buildStatements = () => {
      return {
        statements: Object.keys(valueMap).map( key => {
          console.log('key::::\n',key);
          console.log('value::::\n',valueMap[key]);
          return buildStatement(key, valueMap[key]);
        })
      }
    };

    if(!definitions.rules[ahjData.ruleId]) {
      const error = { error: `Invalid Rule ID / Rule Definition Not Yet Created :: ${ahjData.ruleId}` };
      Errors.push(error);
      return error
    }

    const valueMap = Object.assign({},
      ...valueHeaders.map(key=>{
        if(ahjData[key]!=="") return {
          [key]: ahjData[key]
        }
      })
    );

    const descriptionMap =  Object.assign({},
      ...valueHeaders.map(key=>{
        const description = parseDesc(key,ahjData[key],ruleDefinition);
        if(description) return {[key]:description}
      })
    );

    const ahjContainsValues = ( Object.keys(valueMap).length > 0 );

    if( ahjContainsValues ) return {
      rules: {
        [ahjData.ruleId]: Object.assign({},
          buildStatements()
        )
      }
    }
  };

  if(Errors.length>0) {
    console.log('Errors::::',Errors);
  }

  if(inherit) console.log('inherit',inherit);

  return Object.assign({},
    inherit ? { inherit } : buildRules(ahjData),
    ...metaDataFields.map(field=>{
        if(ahjData[field]) return {[field]:ahjData[field]}
    })
  )
};



export const parseAhjs = (params) => {

  initialize(params);

  return Object.assign({},
    ...collection.map(ahjData=>{
      return {
        [ahjData.id]:buildAhj(ahjData)
      }
    })
  );

};
