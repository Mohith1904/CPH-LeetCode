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
        <button class="button" id="runTestcaseButton">Run Testcases</button>
        <div>
            <input id="problemUrl" type="text" placeholder="Enter problem URL" style="width: 80%; padding: 8px; margin: 8px 0; border: 1px solid #3c3c3c; border-radius: 4px; background-color: #1e1e1e; color: #d4d4d4;" />
            <button class="button" id="fetchTestcaseButton">Fetch Testcase</button>
        </div>

        <div id="testcaseContainer">
            <!-- Test cases will be added here dynamically -->
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi(); // Required to communicate with the extension

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
                <textarea rows="4" placeholder="Enter input"></textarea>
                <label>Expected Output:</label>
                <textarea rows="4" placeholder="Enter expected output"></textarea>
                <label>Actual Output:</label>
                <textarea rows="4" placeholder="Actual output will appear here" readonly></textarea>
                <button class="button deleteButton">Delete Testcase</button>
            \`;

            const deleteButton = testcaseDiv.querySelector('.deleteButton');
            deleteButton.addEventListener('click', () => {
                testcaseContainer.removeChild(testcaseDiv);
            });

            testcaseContainer.appendChild(testcaseDiv);
        });

        // Fetch Testcase Button Logic
        fetchTestcaseButton.addEventListener('click', () => {
            const problemUrl = problemUrlInput.value.trim();
            if (!problemUrl) {
                alert('Please enter a valid problem URL');
                return;
            }
            vscode.postMessage({
                command: 'fetchTestcase',
                url: problemUrl
            });
        });

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;

            if (message.command === 'displayTestcases') {
                // Clear existing test cases
                testcaseContainer.innerHTML = '';

                // Add fetched test cases
                message.testcases.forEach(testcase => {
                    const testcaseDiv = document.createElement('div');
                    testcaseDiv.className = 'testcase';

                    testcaseDiv.innerHTML = \`
                        <label>Input:</label>
                        <textarea rows="4" readonly>\${testcase.input}</textarea>
                        <label>Expected Output:</label>
                        <textarea rows="4" readonly>\${testcase.output}</textarea>
                    \`;

                    testcaseContainer.appendChild(testcaseDiv);
                });
            }
        });
    </script>
</body>
</html>`;
}

module.exports = getWebviewContent;
