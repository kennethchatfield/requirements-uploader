const express = require('express');
const config = require('../../config');
const urlSign = require('../utilitites/urlSign');
const getData = require('../utilitites/getData');


const router = express.Router();

router.route('/address/')
    .post(function(req, res){
        const queryString = req.body.queryString;
        const url = `${config.google.geocodeUrl}address=${ queryString }&client=${config.google.client}`;
        const signedUrl = urlSign(url,config.google.secret);
        console.log('signedUrl',signedUrl);
        getData(signedUrl).then(data=>{
            console.log('data---\n',data);
            res.send(data);
        },err=>{
          console.error('Error@@:',err);
            res.send({error:'Unable to Geocode'})
        })
    });

module.exports = router;
