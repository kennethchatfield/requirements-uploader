import { unique } from './utilities';

const getHeaders = (collection, headers = []) => {
  const exclude = ["queryString"];
  for( let i = 0; i < 10; i++ ){
    headers = [...headers,...Object.keys(collection[i]).filter((key)=>{return !exclude.includes(key)})]
  }
  return unique(headers);
};

const reformatCollection = (collection) => {
  const headers = getHeaders(collection);
  let lines = [headers];
  collection.map(item=>{
    lines.push(headers.map(header=>{return item[header]}))
  });
  console.log('lines',lines);
  return lines;
};

export const downloadCSV = (rows, collection) => {
  if(collection) rows = reformatCollection(collection);
  let csvContent = "data:text/csv;charset=utf-8,";
  let flat = [];
  rows.forEach(function(rowArray){
    const row = rowArray.map(cell=>{
      if(typeof cell === 'string' && cell.indexOf(",")>0) return `\"${cell}\"`;
      return cell
    }).join(",");
    csvContent += row + "\r\n"; // add carriage return
  });
  console.log('csvContent',csvContent);
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "GEocoded Data.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
};
