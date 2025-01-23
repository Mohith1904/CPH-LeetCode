const vscode = require('vscode');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function run_file(filepath, language) {
    let run_cmd = "";
    const dir_path = path.dirname(filepath);


    if(language == 'python'){
        run_cmd = `python ${filepath}`;
    }else if(language = 'cpp'){
        run_cmd = `g++ -std=c++17 -o "${dir_path}/cph_outfile" ${run_file}\n"${dir_path}/cph_outfile"`;
    }

    exec(run_cmd, (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage(`Error executing file: ${stderr}`);
        } else {
            vscode.window.showInformationMessage(`Execution result: ${stdout}`);
        }
        // Clean up the temporary file
        fs.unlinkSync(filepath);
    }); 
    
}

module.exports = run_file;

run_file(`S:\projects\leetcode_cph\cph-leetcode\hello.cpp`, 'cpp');