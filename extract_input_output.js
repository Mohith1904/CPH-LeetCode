const cheerio = require('cheerio');


async function extract_input_output(content){
   

        const $ = cheerio.load(content);

        let inputs = [];
        let outputs = [];
        
        $('pre').each((index, element) => {
            const text = $(element).text().trim();
        
            const inputMatch = text.match(/Input:\s*(.*)/);
            const outputMatch = text.match(/Output:\s*(.*)/);
        
            if (inputMatch) inputs.push(inputMatch[1].trim());
            if (outputMatch) outputs.push(outputMatch[1].trim());
        });
        return {inputs, outputs};
}

module.exports = extract_input_output;