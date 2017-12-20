import 'whatwg-fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);

  error.response = response;
  throw error;
}
function parseJSON(response) {
    if(response)return response.json();
}

const transformToQString = (addressObj) => {
  const order = ['street','city','county','state','zip'];
  let qString;
  order.map(key=>{
    if(addressObj[key]!==""){
      if(!qString) qString = addressObj[key];
      else qString += `, ${addressObj[key]}`
    }
  });
  return qString.split(' ').join('+');
};

const useOriginalName = ['b476ec5a-579b-49cb-865e-886409a9d6ce','Utility'];
const getAddressComponents = (addressComponents, type, id) => {
  let addressObject = {};
  if(['City','County','Utility'].includes(type)){
    addressComponents.map(item=>{
      if(item.types.includes('administrative_area_level_1') && !addressObject["state"]) addressObject["state"] = item.long_name;
      if(item.types.includes('administrative_area_level_2') && !addressObject["county"]) addressObject["county"] = item.long_name;
      if( (item.types.includes('locality') ||
        item.types.includes('neighborhood') ||
        item.types.includes('sublocality') ||
        item.types.includes('natural_feature') ||
        (item.types.includes('administrative_area_level_3')&&isNaN(item.long_name)) ||
        item.types.includes('colloquial_area')) && !addressObject["city"]) addressObject["city"] = item.long_name;
    });
    if(!useOriginalName.includes(id) && !useOriginalName.includes(type)) addressObject.name = addressObject[type];
  }
  return addressObject;
};

const parseGeocodeResults = (data, query) => {
  if(data&&data.results&&data.results[0]){
    const topResult = data.results[0];
    const {address_components, geometry } = topResult;
    if(query.id==='adf41104-d8ff-4325-bab6-338b17e45f2c'||query.id==='40ba994a-05a4-49dd-8e1a-4cf1dba0b10c'||query.id==='b476ec5a-579b-49cb-865e-886409a9d6ce'){
      console.log('address_components:::::\n',address_components);
    }
    const { lat, lng } = geometry.location;
    return Object.assign({}, query, {
      longitude: lng,
      latitude:lat,
      formattedAddress: topResult.formatted_address
    },getAddressComponents(address_components,query.type,query.id));
  }
  return Object.assign(
    data.status==='ZERO_RESULTS'?{error:data.status}:{},
    data, query,
  );
};

const geocode = (query) => {
  // console.log('query',JSON.parse(JSON.stringify(query)));
  // console.log('query.queryString',JSON.parse(JSON.stringify(query.queryString)));
  // console.log('query.type',JSON.parse(JSON.stringify(query.type)));
  console.log('query.queryString',query.queryString);
  if(typeof query.queryString !== "string"){
    query.queryString = transformToQString(query.queryString);
  }
  return new Promise((resolve, reject) => {
    if(!query.queryString||query.type==='Office') {
      console.log('query.latitude',query.latitude);
      if(query.latitude&&query.longitude) resolve(parseGeocodeResults(query,query));
      return resolve(parseGeocodeResults({}, Object.assign({error:"No Address to Query"},query)));
    }
    fetch('/api/geocode/address/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        queryString:query.queryString
      })
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(function(data) {
        resolve(parseGeocodeResults(data, query));
      }).catch(function(error) {
      reject(error);
    });
  });
};

class GeocodeApi {
  static geocodeAddress(query) {
    return new Promise((resolve, reject) => {
      geocode(query).then(data=>resolve(data));
    });
  }
  static batchGeocodeAddress(queries) {
    console.log('queries:::\n',queries);
    // const queries = queryStrings.map(queryString=>{
    //   return {type,queryString}
    // });
    return Promise.all(queries.map(geocode));
  }
}
export default  GeocodeApi;
