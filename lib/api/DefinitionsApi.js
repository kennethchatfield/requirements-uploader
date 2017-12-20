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


class DefinitionsApi {
    static getDefinitions() {
        return new Promise((resolve, reject) => {
            fetch('/api/definitions/scan/', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })
                .then(checkStatus)
                .then(parseJSON)
                .then(function(data) {
                    return resolve(data);
                }).catch(function(error) {
                reject(error);
            });
        });
    }
    static getDefinitionsMap() {
        return new Promise((resolve, reject) => {
            DefinitionsApi.getDefinitions().then(definitions=>{
                let definitionsMap = {conditions:{},rules:{}};
                definitions.map(definition=>{
                    if(definition.rule) definitionsMap.rules[definition.id] = definition;
                    if(definition.condition) definitionsMap.conditions[definition.id] = definition;
                });
                resolve(definitionsMap)
            })
        })
    }
}
export default  DefinitionsApi;