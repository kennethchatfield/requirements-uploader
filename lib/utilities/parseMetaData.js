import info from './info';
import { parseContent } from './utilities'

module.exports = (results) => {

  try {
    let parsed = [];

    if(!results||results.length===0)  new Error('Invalid Input');

    const hasErrors = (field, item) => {
      return !field || !item[field] || !item.id ||
        !info.metaDataFields.includes(field);
    };


    const valid = results.map(item=>{
      const field = item.ruleId;
      if(hasErrors(field,item)) {
        parsed.push({id:item.id});
        return false;
      }
      const dataType = info.metaDataMapping[field];
      parsed.push({
        id: item.id,
        [field]: parseContent(dataType, item[field])
      })
    });

    if(valid.includes(false)) new Error('Parse Failed');

    console.log('parsed',parsed);
    return parsed;

  } catch (error) {
    console.log('Error:',error);
  }

};
