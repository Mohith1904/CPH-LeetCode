

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
        run_cmd = `g++ ${filepath} -o cph_outfile && cph_outfile.exe  < ${input_file}`;
    }else if(language == 'c'){
        run_cmd = `gcc ${filepath} -o c_outfile && c_outfile.exe  < ${input_file}`;
    }else if(language == 'javascript'){
        run_cmd = `node ${filepath}  < ${input_file}`;
    }else if(language == 'java'){
        const classname = filepath.split('/').pop().replace('.java', '');
        run_cmd = `javac ${filepath} && java ${classname}  < ${input_file}`;
    }

    await exec(run_cmd, (err, stdout, stderr) => {
        if (err) {
            vscode.window.showErrorMessage(`Error executing file: ${stderr}`);
        } else {
            vscode.window.showInformationMessage(`Execution result: ${stdout}`);
            fs.writeFileSync(path.join(dir_path, 'cph_output.txt'), stdout, 'utf8');
        }
        // fs.unlinkSync(filepath);
    }); 
    
}

module.exports = run_file;

// run_file(`S:\projects\leetcode_cph\cph-leetcode\hello.cpp`, 'cpp');