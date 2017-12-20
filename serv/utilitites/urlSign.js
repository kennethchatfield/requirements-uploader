const url = require('url');
const crypto = require('crypto');


module.exports = function(apiUrl, keyString) {

    // converting key to bytes will throw an exception, need to replace '-' and '_' characters first.
    const usablePrivateKey = keyString.replace(/[-]/g, '+').replace(/[_]/g, '/');

    const privateKeyBytes = new Buffer(usablePrivateKey, 'base64');
    const uri = url.parse(apiUrl);

    // compute the hash
    const algorithm = crypto.createHmac('sha1', privateKeyBytes);
    const hash = algorithm.update(uri.path).digest('base64');

    // convert the bytes to string and make url-safe by replacing '+' and '/' characters
    const signature = hash.replace(/[+]/g, '-').replace(/[/]/g, '_');

    // add the signature to the existing URI
    return uri.protocol + '//' + uri.host + uri.path + '&signature=' + signature;
};
