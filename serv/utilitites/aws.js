const AWS = require('aws-sdk');

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com"
});

const getItems = (getParams) => {
  return Promise.all(getParams.map(getItem))
};

const getItem = ({TableName,id}) => {
  return new Promise((resolve, reject) => {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const params = {
      TableName,
      Key: { id },
    };

    docClient.get(params, function(err, data) {
      if (err) {
        throw new Error (`Unable to read item. Error JSON:\n${JSON.stringify(err, null, 2)}`)
      } else {
        resolve(data.Item);
      }
    });
  });
};

module.exports = {
  getItems,
  getItem
};
