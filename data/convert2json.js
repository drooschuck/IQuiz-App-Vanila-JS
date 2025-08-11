const fs = require('fs');
const path = require('path');

// Function to read and convert .js files to JSON
function convertJsToJson(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // Recursively call for subdirectories
                convertJsToJson(filePath);
            } else if (file.isFile() && file.name.endsWith('.js')) {
                // Process .js files
                processJsFile(filePath);
            }
        });
    });
}

// Function to process a single .js file
function processJsFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}: ${err}`);
            return;
        }

        // Extract subject name
        const subjectNameMatch = data.match(/export let quizSubject = "(.*?)";/);
        const subjectName = subjectNameMatch ? subjectNameMatch[1] : "Unknown Subject";

        // Extract questions
        const questionsMatch = data.match(/let questions = (\[.*?\]);/s);
        const questionsArray = questionsMatch ? JSON.parse(questionsMatch[1]) : [];

        // Create the JSON object
        const jsonObject = {
            subjectName: subjectName,
            keyStage: "Unknown Key Stage", // You can modify this as needed
            icon: "Unknown Icon", // You can modify this as needed
            quizTitle: "Unknown Quiz Title", // You can modify this as needed
            questions: questionsArray.map(q => ({
                text: q.question,
                answer: q.answer,
                options: q.options
            }))
        };

        // Define the output JSON file path
        const outputFilePath = filePath.replace(/\.js$/, '.json');

        // Write the JSON object to a file
        fs.writeFile(outputFilePath, JSON.stringify(jsonObject, null, 2), (err) => {
            if (err) {
                console.error(`Error writing file ${outputFilePath}: ${err}`);
            } else {
                console.log(`Converted ${filePath} to ${outputFilePath}`);
            }
        });
    });
}

// Start the conversion process from the current directory
const startDir = path.resolve(__dirname);
convertJsToJson(startDir);
