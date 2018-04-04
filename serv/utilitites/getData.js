const fetch = require('node-fetch');

module.exports = url => {
    return new Promise((resolve, reject)=>{
        fetch(url)
            .then( res => {
                console.log('res',res);
                return res.json();
            }).then( json => {
                resolve(json);
            }).catch( err => {
            console.error('Error: ',reject);
                reject(err);
            });
    });
};
