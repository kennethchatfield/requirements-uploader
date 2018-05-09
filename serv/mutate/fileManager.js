const fs = require('fs');
const path = require('path');
const glob = require('glob');

const parseFileName = ( path ) => {
   return path.split('/')
    .pop()
    .split('.')
    .shift();
}

const saveFile = ({filename, contents}) => {
  return new Promise((resolve, reject) => {

    const location = `${path.resolve(__dirname)}/data/${filename}.txt`;

    fs.writeFile(location, contents, 'utf8', function (err) {
      if (err) reject( err );
      else resolve({ code: contents });
    });
  });
};


const fetchFiles = (directory) => {
  directory = directory || `${path.resolve(__dirname)}/data`;
  return new Promise((resolve, reject) => {
    glob(`${directory}/*.txt`, function(err, files) {
      if(err) {
        reject(`cannot read the folder, something goes wrong with glob\n Error: \t ${ err.message }`)
      } else {
        resolve(files);
      }
    })
  })
};


const readAllFiles = (files) =>{
  return Promise.all(files.map(readFile))
};

const readFile = (file) => {
  console.log('readFile::::::::\n',file);
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', function (err, data) {
      if(err) {
        console.log("cannot read the file, something goes wrong with the file", err);
        reject(err)
      }
      resolve({
        name: parseFileName(file),
        text: data
      });
    });
  });
};

const getAllFiles = () => {
  return new Promise((resolve, reject) => {
    fetchFiles()
      .then( files => {
        readAllFiles(files)
          .then( fileCollection => {
            resolve( fileCollection );
          })
      })
  });
};


module.exports = {
  saveFile,
  getAllFiles
};
