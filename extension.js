const {getQuestionData} = require('./get_example_testcases.js');
const process_testCases = require('./process_testcases.js');
const run_file = require('./run_file.js');
const fs = require('fs');
const path = require('path');

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cph-leetcode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = await vscode.commands.registerCommand('cph-leetcode.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from cph_leetcode!');
	});

	const run_testCases = await vscode.commands.registerCommand('cph-leetcode.run_testCases', async function(){
		const question_url = await vscode.window.showInputBox({
			prompt: 'Provide Question URL'
		});
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
            vscode.window.showErrorMessage("No active text editor found.");
            return;
        }
		const url_segments = question_url.split('/');
		if (url_segments.length < 5 || !url_segments[4]) {
			vscode.window.showErrorMessage("Invalid URL format. Please provide a valid question URL.");
			return;
		}
		const question_name = url_segments[4];
		const filePath = editor.document.fileName;
		const language = editor.document.languageId;
		const dir_path = path.dirname(filePath);
		let example_testCases = await getQuestionData(question_name, 'exampleTestcases', vscode);
		if(example_testCases == null) return;
		example_testCases = await process_testCases(example_testCases);
		try {
            fs.writeFileSync(path.join(dir_path, 'cph_input.txt'), example_testCases, 'utf8');
        } catch (err) {
            vscode.window.showErrorMessage(`Error writing to input.txt: ${err.message}`);
        }
		console.log(example_testCases);
		
		await run_file(filePath, language);

	});

	await context.subscriptions.push(run_testCases);
	await context.subscriptions.push(disposable);
	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
