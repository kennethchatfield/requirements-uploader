const express = require('express');
const AWS = require('aws-sdk');
const { getItems } = require('../utilitites/aws');


const router = express.Router();

router.route('/scan/:TableName')
    .get(function(req, res){
      let TableItems = [];
      const docClient = new AWS.DynamoDB.DocumentClient();
      const { TableName } = req.params;
      const params = { TableName };
      const onScan = (err, data) => {
        if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          TableItems = [...TableItems,...data.Items];
          if (typeof data.LastEvaluatedKey != "undefined") {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
          } else {
            res.send(TableItems);
          }
        }
      };
      docClient.scan(params, onScan);
    });

router.route('/delete/')
  .post(function(req,res){
    const docClient = new AWS.DynamoDB.DocumentClient();
    const { params } = req.body;
    docClient.delete(params, function(err, data) {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        res.send(data);
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
  });

router.route('/put/')
  .post(function(req,res){
    const docClient = new AWS.DynamoDB.DocumentClient();
    const { params } = req.body;
    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to Put item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        res.send(data);
        console.log("Put Item succeeded:", JSON.stringify(data, null, 2));
      }
    });
  });

router.route('/batch/')
  .post(function(req,res){
    console.log('innnnnn batch');
    const ddb = new AWS.DynamoDB();
    const { params } = req.body;
    console.log('params', JSON.stringify(params));
    const onBatch = (err, data) => {
      if (err) {
        console.error("Batchwrite failed: " + err, err.stack);
      } else {
        let unprocessed = data.UnprocessedItems;
        if (Object.keys(unprocessed).length === 0) {
          res.send('success?');
          console.log("Processed all items.");
        } else {
          // some unprocessed items, do it again
          console.log("Retry btachwriting...");
          let parameters = {};
          parameters["RequestItems"] = data.UnprocessedItems;
          ddb.batchWriteItem(parameters,onBatch)
        }
      }

    };
    ddb.batchWriteItem(params, onBatch);
  });

router.route('/getItems/')
  .post(function(req,res){
    console.log('req.body',req.body);
    const { params } = req.body;
    getItems( params ).then( Items => {
      res.send(Items)
    }).catch(err=>{
      console.error('Error:',err)
    })
  });



module.exports = router;
