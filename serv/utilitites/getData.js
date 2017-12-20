const fetch = require('node-fetch');

module.exports = function(url) {
    return new Promise((resolve, reject)=>{
        fetch(url)
            .then(function(res) {
                console.log('res',res);
                return res.json();
            }).then(function(json) {
                resolve(json);
            }).catch(err=>{
            console.error('Error: ',reject);
                reject(err);
            });
    });
};
