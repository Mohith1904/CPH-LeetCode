const cheerio = require('cheerio');


async function extract_input_output(content){
        // Assuming you have HTML content stored in a variable called htmlContent
   

        const $ = cheerio.load(content);

        // Initialize arrays to store inputs and outputs
        let inputs = [];
        let outputs = [];
        
        // Iterate over <pre> elements
        $('pre').each((index, element) => {
            const text = $(element).text().trim();
        
            // Extract input and output using regex
            const inputMatch = text.match(/Input:\s*(.*)/);
            const outputMatch = text.match(/Output:\s*(.*)/);
        
            if (inputMatch) inputs.push(inputMatch[1].trim());
            if (outputMatch) outputs.push(outputMatch[1].trim());
        });
        return {inputs, outputs};
}

module.exports = extract_input_output;