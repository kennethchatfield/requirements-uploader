const express = require('express');
const { saveFile, getAllFiles } = require('../mutate/fileManager');

const router = express.Router();

//api/mutate
router.route('/save/:name')
  .post(( req, res ) => {
    const { code } = req.body;
    const { name } = req.params;
    console.log( 'code::::\n', code );

    if( !code || !name || code === "" || name === "" ){
      return res.status(500)
        .send('Invalid Parameters')
    }

    saveFile({ contents:code, filename:name })
      .then( ( data ) => {
        res.send( data )
      })
      .catch( err => {
        res.status(500)
          .send(err.message)
      })
  });

router.route('/get/all')
  .get(( req, res ) => {
    getAllFiles()
      .then( fileCollection  => {
        console.log('fileCollection:::::\n',fileCollection);
        const fileMap = Object.assign({},
          ...fileCollection.map( ({name, text}) => (
            { [ name ]: text }
          ))
        );
        res.send( fileMap )
      })
      .catch( err => {
        res.status(500)
          .send(err.message)
      })
  });

module.exports = router;
