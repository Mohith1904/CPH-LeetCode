const vscode = require('vscode');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

async function run_file(filepath, language) {
    let run_cmd = "";
    const dir_path = path.dirname(filepath);
    const input_file = path.join(dir_path, 'cph_input.txt');

    if(language == 'python'){
        run_cmd = `python ${filepath} < ${input_file}`;
    }else if(language == 'cpp'){
        run_cmd = `g++ ${filepath} -o cph_outfile && cph_outfile  < ${input_file}`;
    }else if(language == 'c'){
        run_cmd = `gcc ${filepath} -o c_outfile && c_outfile  < ${input_file}`;
    }else if(language == 'javascript'){
        run_cmd = `node ${filepath}  < ${input_file}`;
    }else if(language == 'java'){
        const classname = filepath.split('/').pop().replace('.java', '');
        run_cmd = `javac ${filepath} && java ${classname}  < ${input_file}`;
    }

    try {
        const output = await new Promise((resolve, reject) => {
            exec(run_cmd, (err, stdout, stderr) => {
                if (err) {
                    vscode.window.showErrorMessage(`Error executing file: ${stderr}`);
                    reject(stderr);  // Reject the promise with error
                } else {
                    vscode.window.showInformationMessage(`Execution result: ${stdout}`);
                    resolve(stdout);  // Resolve the promise with output
                }
            });
        });

        console.log('Output:', output);
        return output;
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = run_file;
