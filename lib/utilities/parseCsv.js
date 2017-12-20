export const handleCsv = (e,cb) => {
  // Check for the various File API support.
  const { files } = e.target;
  console.log('init-handleCsv', files);
  if (window.FileReader) {
    // FileReader are supported.
    if(files.length>1){
      for (let i = 0; i < files.length; i++){
        getAsText(files[i]);
      }
    } else {
      getAsText(files[0]);
    }
  } else {
    alert('FileReader are not supported in this browser.');
  }

  function getAsText(fileToRead,index) {
    console.log('init-getAsText');
    var reader = new FileReader();
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = (event) => {loadHandler(event,fileToRead)};
    reader.onerror = errorHandler;
  }

  function loadHandler(event,file) {
    console.log('loadHandler-event',event);
    var csv = event.target.result;
    let fileName = file.name;
    cb(processData(csv, file));
  }

  function processData(csv, file) {

    return CSVToArray(csv,file);
  }

  function errorHandler(evt) {
    console.log('init-errorHandler');
    if(evt.target.error.name == "NotReadableError") {
      alert("Canno't read file !");
    }
  }

const CSVToArray = ( strData, file, strDelimiter ) => {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
  );

  var arrData = [[]];
  var arrMatches = null;
  while (arrMatches = objPattern.exec(strData)) {
    var strMatchedDelimiter = arrMatches[1];
    if (
      strMatchedDelimiter.length &&
      (strMatchedDelimiter != strDelimiter)
    ) {
      arrData.push([]);
    }
    var strMatchedValue;
    if (arrMatches[2]) {
      strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"),
        "\""
      );
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  const headers = arrData.shift();
  return ( arrData.map(a=>{
    return Object.assign({ruleId:file.name.replace('.csv',"")},
      ...a.map((cell,index)=>{
          return {[headers[index]]:cell}
        })
    )
  }) );
  }
};
