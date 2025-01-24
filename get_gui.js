function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Testcase GUI</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #1e1e1e;
            color: #d4d4d4;
        }
        .container {
            padding: 16px;
        }
        .button {
            background-color: #007acc;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            margin: 8px 0;
            border-radius: 4px;
            cursor: pointer;
        }
        .button:hover {
            background-color: #005a9e;
        }
        .button:disabled {
            background-color: #555555;
            cursor: not-allowed;
        }
        .testcase {
            margin: 16px 0;
            padding: 16px;
            border: 1px solid #3c3c3c;
            border-radius: 4px;
            background-color: #252526;
        }
        .testcase input, .testcase textarea {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            border: 1px solid #3c3c3c;
            border-radius: 4px;
            background-color: #1e1e1e;
            color: #d4d4d4;
        }
        .testcase input:focus, .testcase textarea:focus {
            outline: none;
            border-color: #007acc;
        }
    </style>
</head>
<body>
    <div class="container">
        <button class="button" id="addTestcaseButton">Add Testcase</button>
        <button class="button" id="runTestcaseButton">Run All Testcases</button>
        <div>
            <input id="problemUrl" type="text" placeholder="Enter problem URL" style="width: 80%; padding: 8px; margin: 8px 0; border: 1px solid #3c3c3c; border-radius: 4px; background-color: #1e1e1e; color: #d4d4d4;" />
            <button class="button" id="fetchTestcaseButton">Fetch Testcase</button>
        </div>

        <div id="testcaseContainer">
            <!-- Test cases will be added here dynamically -->
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        const addTestcaseButton = document.getElementById('addTestcaseButton');
        const fetchTestcaseButton = document.getElementById('fetchTestcaseButton');
        const problemUrlInput = document.getElementById('problemUrl');
        const testcaseContainer = document.getElementById('testcaseContainer');

        // Add Testcase Button Logic
        addTestcaseButton.addEventListener('click', () => {
            const testcaseDiv = document.createElement('div');
            testcaseDiv.className = 'testcase';

            testcaseDiv.innerHTML = \`
                <label>Input:</label>
                <textarea class="input_case" rows="4" placeholder="Enter input"></textarea>
                <label>Expected Output:</label>
                <textarea class="output_case" rows="4" placeholder="Enter expected output"></textarea>
                <label>Actual Output:</label>
                <textarea class="your_output_case" rows="4" placeholder="Actual output will appear here" readonly></textarea>
                <button class="button runTestcaseButton">Run Testcase</button>
                <button class="button deleteButton">Delete Testcase</button>
            \`;

            // Delete Button Logic
            const deleteButton = testcaseDiv.querySelector('.deleteButton');
            deleteButton.addEventListener('click', () => {
                testcaseContainer.removeChild(testcaseDiv);
            });

            // Run Testcase Button Logic
            const runTestcaseButton = testcaseDiv.querySelector('.runTestcaseButton');
            runTestcaseButton.addEventListener('click', () => {
                const inputField = testcaseDiv.querySelector('.input_case');
                const input = inputField.value.trim();

                if (!input) {
                    alert('Please enter input for the testcase.');
                    return;
                }

                vscode.postMessage({
                    command: 'runTestcase',
                    input: input,
                });

                runTestcaseButton.disabled = true; // Disable the button while processing
            });

            testcaseContainer.appendChild(testcaseDiv);
        });

        // Fetch Testcase Button Logic
        fetchTestcaseButton.addEventListener('click', () => {
            const problemUrl = problemUrlInput.value.trim();
            if (!problemUrl) {
                alert('Please enter a valid problem URL.');
                return;
            }
            vscode.postMessage({
                command: 'fetchTestcase',
                url: problemUrl,
            });
        });

        // Listen for messages from the extension
        window.addEventListener('message', (event) => {
            const message = event.data;

            if (message.command === 'displayTestcases') {
                testcaseContainer.innerHTML = ''; // Clear existing test cases

                // Add fetched test cases
                message.testcases.forEach((testcase) => {
                    const testcaseDiv = document.createElement('div');
                    testcaseDiv.className = 'testcase';

                    testcaseDiv.innerHTML = \`
                        <label>Input:</label>
                        <textarea class="input_case" rows="4" readonly>\${testcase.input}</textarea>
                        <label>Expected Output:</label>
                        <textarea class="output_case" rows="4" readonly>\${testcase.output}</textarea>
                        <label>Actual Output:</label>
                        <textarea class="your_output_case" rows="4" placeholder="Actual output will appear here" readonly></textarea>
                        <button class="button runTestcaseButton">Run Testcase</button>
                    \`;

                    const runTestcaseButton = testcaseDiv.querySelector('.runTestcaseButton');
                    runTestcaseButton.addEventListener('click', () => {
                        vscode.postMessage({
                            command: 'runTestcase',
                            input: testcase.input,
                        });

                        runTestcaseButton.disabled = true; // Disable the button while processing
                    });

                    testcaseContainer.appendChild(testcaseDiv);
                });
            } else if (message.command === 'displayOutput') {
                // Match test case by input and update actual output
                const testcases = testcaseContainer.querySelectorAll('.testcase');
                testcases.forEach((testcaseDiv) => {
                    const inputField = testcaseDiv.querySelector('.input_case');
                    const actualOutputField = testcaseDiv.querySelector('.your_output_case');

                    if (inputField.value.trim() === message.input.trim()) {
                        actualOutputField.value = message.output;
                        const runTestcaseButton = testcaseDiv.querySelector('.runTestcaseButton');
                        runTestcaseButton.disabled = false; // Re-enable the button
                    }
                });
            }
        });
    </script>
</body>
</html>`;
}

module.exports = getWebviewContent;
