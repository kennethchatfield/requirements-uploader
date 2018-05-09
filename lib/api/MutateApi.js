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
  return response.json();
}


class MutateApi {
  static saveCode( code, name ) {
    return new Promise((resolve, reject) => {
      fetch(`/api/mutate/save/${ name || 'blahhh'}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code })
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data) {
          return resolve(data);
        })
        .catch(function(error) {
          console.log('Error', error.response.text());
          reject(error);
        });
    });
  }
  static getAll() {
    return new Promise((resolve, reject) => {
      fetch(`/api/mutate/get/all`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
        .then(checkStatus)
        .then(parseJSON)
        .then( fileMap => (
          resolve( fileMap )
        ))
        .catch(function(error) {
          console.log('Error', error.response.text());
          reject(error);
        });
    });
  }
}
export default  MutateApi;
