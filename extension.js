const getWebviewContent = require('./get_gui.js');
const {getQuestionData} = require('./get_example_testcases.js');
const process_testCases = require('./process_testcases.js');
const run_file = require('./run_file.js');
const fs = require('fs');
const path = require('path');

const vscode = require('vscode');


/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	console.log('Congratulations, your extension "cph-leetcode" is now active!');

	const disposable = await vscode.commands.registerCommand('cph-leetcode.helloWorld', function () {
		
		vscode.window.showInformationMessage('Hello World from cph_leetcode!');
	});

	const gui = await vscode.commands.registerCommand('cph-leetcode.showTestcaseGUI', async function () {
        const panel = vscode.window.createWebviewPanel(
            'testcaseGUI', 
            'Testcase GUI', 
            vscode.ViewColumn.Beside, 
            {
                enableScripts: true, 
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

        panel.webview.onDidReceiveMessage(
			async (message) => {
				if (message.command === 'fetchTestcase') {
					const question_url = message.url.trim();
					if (!question_url) {
						vscode.window.showErrorMessage("No question URL provided.");
						return;
					}
					try {
						console.log(question_url);
						const url_segments = question_url.split('/');
						if (url_segments.length < 5 || !url_segments[4]) {
							vscode.window.showErrorMessage("Invalid URL format. Please provide a valid question URL.");
							return;
						}
						const question_name = url_segments[4];
						
						let content = await getQuestionData(question_name, 'content', vscode);
						if(content == null) return;
						await process_testCases(content, dir_path, vscode);

		
						const inputs = fs.readFileSync(inputFilePath, 'utf8').trim().split('\n\n');
						const outputs = fs.readFileSync(outputFilePath, 'utf8').trim().split('\n\n');
		
						if (inputs.length !== outputs.length) {
							vscode.window.showErrorMessage("Mismatch between number of inputs and outputs in the files.");
							return;
						}
		
						const testcases = inputs.map((input, index) => ({
							input: input.trim(),
							output: (outputs[index] || '').trim(),
						}));
		
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

						await fs.writeFileSync(path.join(dir_path, 'cph_input.txt'), input, 'utf8');
						const output = await run_file(filePath,language);
						console.log(dir_path);
						console.log("run button is pressed");

						panel.webview.postMessage({
							command: 'displayOutput',
							input: input,
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

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
