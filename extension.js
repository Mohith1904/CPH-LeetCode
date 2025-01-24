const getWebviewContent = require('./get_gui.js');
const extract_input_output = require('./extract_input_output.js');
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

	const gui = await vscode.commands.registerCommand('cph-leetcode.showTestcaseGUI', async function () {
        const panel = vscode.window.createWebviewPanel(
            'testcaseGUI', // Identifies the type of the webview
            'Testcase GUI', // Title of the panel
            vscode.ViewColumn.Beside, // Editor column to show the new webview panel in
            {
                enableScripts: true, // Allow JavaScript in the webview
            }
        );

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage("No active text editor found.");
			return;
		}

		const filePath = editor.document.fileName;
		const dir_path = path.dirname(filePath);
		const language = editor.document.languageId;
		const inputFilePath = path.join(dir_path, 'cph_input.txt');
		const outputFilePath = path.join(dir_path, 'cph_output.txt');
        panel.webview.html = getWebviewContent();

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
			async (message) => {
				if (message.command === 'fetchTestcase') {
					const question_url = message.url.trim();
					if (!question_url) {
						vscode.window.showErrorMessage("No question URL provided.");
						return;
					}
					try {
						// Log or use the question URL as needed
						console.log("Fetching test cases for URL:", question_url);
						const url_segments = question_url.split('/');
						if (url_segments.length < 5 || !url_segments[4]) {
							vscode.window.showErrorMessage("Invalid URL format. Please provide a valid question URL.");
							return;
						}
						const question_name = url_segments[4];
						
						let content = await getQuestionData(question_name, 'content', vscode);
						if(content == null) return;
						await process_testCases(content, dir_path, vscode);

		
						// Read input and output files
						const inputs = fs.readFileSync(inputFilePath, 'utf8').trim().split('\n\n');
						const outputs = fs.readFileSync(outputFilePath, 'utf8').trim().split('\n\n');
		
						if (inputs.length !== outputs.length) {
							vscode.window.showErrorMessage("Mismatch between number of inputs and outputs in the files.");
							return;
						}
		
						// Prepare test cases
						const testcases = inputs.map((input, index) => ({
							input: input.trim(),
							output: (outputs[index] || '').trim(),
						}));
		
						// Send test cases back to the webview
						panel.webview.postMessage({
							command: 'displayTestcases',
							testcases: testcases,
						});
					} catch (error) {
						vscode.window.showErrorMessage("Error reading test case files: " + error.message);
					}
				}else if(message.command == 'runTestcase'){
					const input = message.input;
					console.log(input);

					try {
						// Assuming you have a function `run_file_with_input` to run the code with given input

						await fs.writeFileSync(path.join(dir_path, 'cph_input.txt'), input, 'utf8');
						const output = await run_file(filePath,language);
						console.log(dir_path);
						console.log("run button is pressed");
						// Execute the file with the provided input and get the output

						// Send the output back to the webview
						panel.webview.postMessage({
							command: 'displayOutput',
							input: input, // Include input to match it in the webview
							output: output,
						});
					} catch (error) {
						vscode.window.showErrorMessage("Error running test case: " + error.message);
					}
				}
			},
			undefined,
			context.subscriptions
		);
		
		
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
		let content = await getQuestionData(question_name, 'content', vscode);
		if(content == null) return;
		await process_testCases(content, dir_path, vscode);
		
		await run_file(filePath, language);

	});
	await context.subscriptions.push(run_testCases);
	await context.subscriptions.push(gui)
	await context.subscriptions.push(disposable);
	
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
