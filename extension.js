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
		const question_name = question_url.split('/')[4];
		let example_testCases = await getQuestionData(question_name, 'exampleTestcases');
		example_testCases = await process_testCases(example_testCases);
		console.log(example_testCases);
		const editor = vscode.window.activeTextEditor;
		const filePath = vscode.window.activeTextEditor.document.uri.fsPath;
		run_file(filePath, 'python');	

	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(run_testCases);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
