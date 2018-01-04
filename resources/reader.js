function readCSV(fname) {
  const reader = new FileReader();
  let result;
  reader.onload = function(e){
    result = reader.result.split('\n').map(row => row.split(','));
  }
  reader.readAsText(fname);
  return result;
}
