
const mustHave = (collection,must) => {
  const hasMust = (item) => {
    return !Object.keys(must).map(key=>{
      return item[key] === must[key]
    }).includes(false);
  };

  return collection.filter(hasMust)
};
const order = (collection,orderBy) => {
  let returnObject = {};
  collection.map(item=>{
    const key = (orderBy !== 'fullCondition') ? item[orderBy] : `${item.left} ${item.operator} ${item.right}`;
    if(!returnObject[key]) returnObject[key] = [];
    returnObject[key].push(item);
  });
  return returnObject;
};

module.exports = ({collection,orderBy,must}) => {


  const filteredCollection = must ? mustHave( collection, must ) : collection;

  let returnObject = order(filteredCollection,orderBy[0]);

  if(orderBy[1]) Object.keys(returnObject).map( one => {
    returnObject[one] = order(returnObject[one],orderBy[1]);
    if(orderBy[2]) Object.keys(returnObject[one]).map( two => {
      returnObject[one][two] = order(returnObject[one][two],orderBy[2]);
      if(orderBy[3]) Object.keys(returnObject[one][two]).map( three => {
        returnObject[one][two][three] = order(returnObject[one][two][three],orderBy[3]);
        if(orderBy[4]) Object.keys(returnObject[one][two][three]).map( four => {
          returnObject[one][two][three][four] = order(returnObject[one][two][three][four],orderBy[4]);
          if(orderBy[5]) Object.keys(returnObject[one][two][three][four]).map( five => {
            returnObject[one][two][three][four][five] = order(returnObject[one][two][three][four][five],orderBy[5]);
          })
        })
      })
    })
  });
  return returnObject;
};
