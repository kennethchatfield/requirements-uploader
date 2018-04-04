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


class DynamobdApi {
    static scan(TableName) {
        console.log('TableName',TableName);
        return new Promise((resolve, reject) => {
            fetch(`api/dynamodb/scan/${TableName}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(function(data) {
                    resolve(data);
                }).catch(function(error) {
                reject(error);
            });
        });
    }
  static deleteItem(params) {
    return new Promise((resolve, reject) => {
      fetch(`api/dynamodb/delete/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ params })
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data) {
          resolve(data);
        }).catch(function(error) {
        reject(error);
      });
    });
  }
  static putItem(params) {
    return new Promise((resolve, reject) => {
      fetch(`api/dynamodb/put/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ params })
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data) {
          resolve(data);
        }).catch(function(error) {
        reject(error);
      });
    });
  }
  static putAll(all,TableName){
    const Items = all.map(Item=>{
      return { TableName, Item}
    });
    return Promise.all(
      Items.map(DynamobdApi.putItem)
    )
  }
  static deleteMultiple(Items,TableName) {
    const parameters = Items.map(Item=>{
      return { TableName, Key:{id:Item.id} };
    });
    return Promise.all(
      parameters.map(DynamobdApi.deleteItem)
    )
  }
  static batch(requestType, Items,TableName){
    const params = {
      RequestItems:{
        [TableName]: Items.map(Item=>{
          return {[requestType]:{
            Item:Object.assign({},Item,{id:{S:Item.id}})
          }}
        })
      }
    };
    return new Promise((resolve, reject) => {
      fetch(`api/dynamodb/batch/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ params })
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data) {
          resolve(data);
        }).catch(function(error) {
        reject(error);
      });
    });
  }
  static getAhjs(params){
    return new Promise((resolve, reject) => {
      fetch(`api/dynamodb/getItems/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ params })
      })
        .then(checkStatus)
        .then(parseJSON)
        .then(function(data) {
          resolve(data);
        }).catch(function(error) {
        reject(error);
      });
    });
  }
  static mergeTables(fromTable,toTable){
    return new Promise((resolve,reject)=>{
      DynamobdApi.scan(fromTable).then(data=>{
        console.log('DynamobdApi',data)
      })
    })
  }
}
export default DynamobdApi;
