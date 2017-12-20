const express = require('express');
const AWS = require('aws-sdk');

const router = express.Router();

router.route('/scan/')
    .get(function(req, res){
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: `ahj-definitions-stage`,
        };
        docClient.scan(params, function(err, data) {
            if (err) console.log(err);
            res.send(data.Items);
        });
    });

module.exports = router;