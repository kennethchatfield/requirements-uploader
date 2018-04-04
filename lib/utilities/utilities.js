import info from './info'

export const getAddressComponents = (addressComponents) => {
  let addressObject = {};

  addressComponents.map(item=>{
    if(item.types.includes('administrative_area_level_1') && !addressObject["State"]) addressObject["State"] = item.long_name;
    if(item.types.includes('administrative_area_level_2') && !addressObject["County"]) addressObject["County"] = item.long_name;
    if( (item.types.includes('locality') ||
      item.types.includes('neighborhood') ||
      item.types.includes('sublocality') ||
      (item.types.includes('administrative_area_level_3')&&isNaN(item.long_name)) ||
      item.types.includes('colloquial_area')) && !addressObject["City"]) addressObject["City"] = item.long_name;
  });
  return addressObject;
};

const s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const guid = () => {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};



export const createAhj = () => {
 return {
   id: guid()
 }
};

export const findItem = (collection,search) => {
  let item, count = 0;
  const searches = Object.keys(search);
  if(collection.length === 0 ) return item;
  do {
    const valid = searches.map(key=>{
      return collection[count][key] === search[key]
    });
    if(!valid.includes(false)) item = collection[count];
    count++
  } while ( item === undefined && count<collection.length-2 );
  return item;
};

export const isUnique = (item,collection,compare) => {
  let unique = true;
  collection.map(obj=>{
    const match = Object.keys(compare).map(prop=>{return obj[prop] === compare[prop]});
    if(!match.includes(false)) unique = false;
  });
  return unique;
};

export const pickMetaData = (item, genGuid) => {
  return Object.assign( {},
    ...info.metaDataFields.map(fieldName=>{
      if(genGuid && fieldName==='id' && !item[fieldName] ) return {[fieldName]:guid()};
      if(item[fieldName]) return {[fieldName]:item[fieldName]};
    })
  )
};


export const buildQueryString = (data) => {
  console.log('data',data);
  const reformatName = (name,type) => {
    const getPostFix = () => {
      if(type!=='County') return "";
      if(name.toLowerCase().indexOf('county')>0) return "";
      return "+County"
    };
    const postFix = getPostFix();
    return name.split(' ').join('+')+postFix
  };
  return `${ reformatName(data.name,data.type) },+${data.state}`;

};

export const unique = (a) => {
  const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };
  return a.filter( onlyUnique );
};


export const writeToCollection = (c1, c2) => {
  let map = Object.assign({},
    ...c1.map(item=>{return { [item.id]: item }})
  );
  c2.map(item=>{
    map = Object.assign({},map,{[item.id]:item});
  });
  return Object.values(map);
};

export const parseContent = (dataType, content) => {
  const parse = {
    string: () => { return content },
    array: () => { return content.split(',') },
    float: () => { return parseFloat(content) },
    collection: () => { return JSON.parse(content) }
  };
  if(!Object.keys(parse).includes(dataType)) return new Error("Parser Doesn't Support Data Type")
  return parse[dataType]();
};

export const filterCollection = (collection,key,value) => {
  if( key === 'id' && value.includes(',') ) return collection.filter( item => {
    return  value.split(',').includes(item[key]);
  });
  return collection.filter(item=>{
    return item[key] === value;
  });
};

// by object
// export const filterCollection = (collection,obj) => {
//   const keys = Object.keys(obj);
//   return collection.filter(item=>{
//     if(keys.includes(key)) return item[key] === obj[key];
//   });
// };

export const toTitleCase = (str) => {

  // str = str.replace(/[^a-zA-Z0-9_=]/g, " ");

  return str.replace(
    /\w\S*/g,
    function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
};

export const isGuid = (guid) => {
  const regEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regEx.test(guid);
}
