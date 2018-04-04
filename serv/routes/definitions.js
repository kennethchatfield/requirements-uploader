const express = require('express');
const AWS = require('aws-sdk');

const config = require('../../config');

const router = express.Router();

router.route('/scan/:TableName')
    .get(function(req, res){
        const docClient = new AWS.DynamoDB.DocumentClient();
        const { TableName } = req.params;
        const params = {
            TableName
        };
        docClient.scan(params, function(err, data) {
            if (err) console.log(err);
            res.send(data.Items);
        });
    });

module.exports = router;
