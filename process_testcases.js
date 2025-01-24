
const path = require('path');
const cheerio = require("cheerio"); 
const fs = require('fs');

function process_testCases(content, dir_path, vscode){
  const $ = cheerio.load(content);
  let input_testCases = "";
  let output_testCases = "";
  $('pre').each((i, element) => {
    const tc = $(element).text().trim();
    const lines = tc.split("\n").map((line) => line.trim()).filter(Boolean);
    //converting input and output here into json object
    const input_line = lines.find((line) => line.startsWith("Input:")).replace("Input: ", "").trim();
    const outputLine = lines.find((line) => line.startsWith("Output:")).replace("Output: ", "").trim();
    console.log(outputLine);
    output_testCases+=outputLine;
    output_testCases+="\n\n";
    function formatLine(line) {
      return line
        .replace(/\b\w+(?=\s*=\s*)/g, (match) => `"${match}"`) 
        .replace(/\s*=\s*/g, ":"); 
    }

    const input_string = `{${formatLine(input_line)}}`;
    const test_input = JSON.parse(input_string);
    // console.log(test_input);
        
    let result = "";
    
    for (let key in test_input) {
      
      const value = test_input[key];

      if (Array.isArray(value) && value.every(Array.isArray)) {
        // 2D array handling
        const numRows = value.length;
        const numCols = value[0].length;

        result += `${numRows} ${numCols}\n`;
        value.forEach((row) => {
          result += `${row.join(" ")}\n`;
        });
      } else if (Array.isArray(value)) {
        // 1D array handling
        const size = value.length;
        result += `${size}\n`;
        result += `${value.join(" ")}\n`;
      } else {
        // Single value
        result += `${value}\n`;
      }
    }
    input_testCases+=result;
    input_testCases+="\n";
  });
  try {
      fs.writeFileSync(path.join(dir_path, 'cph_input.txt'), input_testCases, 'utf8');
      fs.writeFileSync(path.join(dir_path, 'cph_output.txt'), output_testCases, 'utf-8');
  } catch (err) {
      vscode.window.showErrorMessage(`Error writing to input.txt: ${err.message}`);
  }
  console.log(input_testCases);

}
module.exports = process_testCases;


  