function process_testCases(input) {
    let result = ""; 
    let lines = input.split("\n").map(line => line.trim()).filter(line => line.length > 0);
    lines.forEach(line => {
      if (line[0] === '[' && line[1] === '[') {
        const temp = JSON.parse(line);  
        const numRows = temp.length; 
        const numCols = temp[0].length; 
        // Appending rows and columns to the result
        result += `${numRows} ${numCols}\n`;
        temp.forEach(row => {
          result += `${row.join(' ')}\n`; 
        });
      } 
      else if (line[0] === '[') {
        const temp = JSON.parse(line); 
        const size = temp.length;  
        result += `${size}\n`; 
        result += `${temp.join(' ')}\n`; 
      } 
      else {
        result += `${line}\n`;  
      }
    });
    return result;  
  }
  
  // Example Usage:
  const input = `[[1, 2], [3, 4]]
  [5, 6, 7]
  5
  [5, 6, 7]`;
  
  console.log(process_testCases(input));

  module.exports = process_testCases;

  