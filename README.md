# CPH-LeetCode README

This extension provides a Graphical User Interface (GUI) for managing test cases and serves as a text editor for LeetCode problems. With this extension, you can fetch, add, delete, run, and check the output directly from the user interface.

---

## Features

### **Main features of this extension include:**

- **Fetch Test Cases:**  
  Seamlessly fetch test cases for a problem using its URL. The GUI displays the input, output, and actual output of your code.

- **Add Test Cases:**  
  Add custom test cases with a single click to validate your solution.

- **Run Test Cases:**  
  Execute each test case and display the results in real-time.

- **Delete Test Cases:**  
  Easily remove test cases using the delete option (available for custom test cases only).

---

## Running the Extension

### **1. Clone the Repository**
Run the following command to clone the repository:

```bash
git clone https://github.com/Mohith1904/CPH-LeetCode
```
### 2. Requirements

1. Install *Node.js* (includes npm) from [Node.js official site](https://nodejs.org/).
2. Run the following command to install the required dependencies:
  ```bash
    npm install
    npm install node-fetch cheerio
   ```  
3. Optional: Install the VS Code Extension Development Kit:
  ```bash
   npm install -g yo generator-code
   ``` 
### 3. Navigate to extension.js
   F5 to start debugging

Click `Ctrl+Shift+P` to open the command pallete and run the command **GUI LC CPH**, from there you can access the GUI that will be opened in the side window.   
The GUI will run code of the file that was active while running the command. If you want to run code for another file, please close the GUI and run the command mentioned again with active text editor being the file you want to run.  


## Why Use This Extension
Simplifies test case management.  
Unlike platforms like LeetCode's text editor, this extension lets you utilize VS Code's intelligent auto-completion and debugging tools to write and test your code more efficiently.  
Reduces context switching by integrating directly with your editor.  
Ideal for competitive programming, algorithm testing, and debugging is faster in local environment.  


## 1.0.0

Initial release of CPH-LeetCode  

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
