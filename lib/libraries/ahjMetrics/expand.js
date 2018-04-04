

module.exports = (ahjs) => {

  let expanded = [];

  const stripRules = (rules, source) => {

    const { id, type } = source;

    Object.keys(rules).map( ruleId => {
      const rule = rules[ruleId];
      if(rule.statements){
        rule.statements.map(({value,condition})=>{
          (condition||[{}]).map(({left,operator,right})=>{
            const pushToExpanded = (attrIndex) => {
              expanded.push({
                ruleId,
                conditionId: left,
                value,
                condition,
                left,
                operator,
                right,
                id,
                type,
                source,
                attrIndex
              })
            };
            if( value && value.constructor === Object){
              Object.keys(value).map(attrIndex=>{
                if(attrIndex==='value')console.log("attrIndex==='value'\n",{rule,source});
                if(attrIndex==='description')console.log("attrIndex==='description'\n",{rule,source});
                if(attrIndex==='undefined'||attrIndex===undefined)console.log("attrIndex==='undefined'||attrIndex===undefined'\n",{rule,source});
                pushToExpanded(attrIndex);
              })
            } else {
              pushToExpanded();
            }
          })
        })
      }
    });
  };

  ahjs.map(({rules,id,type,name})=>{
    if(rules){
      stripRules(rules, {id,type,name})
    }
  });

  return expanded

};
