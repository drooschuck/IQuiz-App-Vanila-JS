/**
 * Node.js script to rename files in the current directory and its subfolders,
 * updating the date in the filename (YYYY-MM-DD) to the current date and subsequent dates.
 * Usage: node rename_dates.js
 */

const fs = require('fs').promises;
const path = require('path');

// Function to check if a string is a valid date in YYYY-MM-DD format
function isValidDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return false;
    // Additional format check YYYY-MM-DD
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}

// Function to add days to a Date object
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

// Recursive function to rename files in a directory
async function renameFilesInDirectory(directory) {
    try {
        const files = await fs.readdir(directory);
        const datePattern = /(\d{4}-\d{2}-\d{2})/;

        // Collect matching files and their dates
        const matchedFiles = [];

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                // Recursively rename files in subdirectories
                await renameFilesInDirectory(filePath);
            } else if (stat.isFile() && file.endsWith('.js')) {
                const match = file.match(datePattern);
                if (match) {
                    matchedFiles.push({ filename: file, dateStr: match[1], filePath });
                }
            }
        }

        if (matchedFiles.length === 0) {
            console.log(`No matching files with date pattern found in ${directory}.`);
            return;
        }

        // Sort files by their current date in filename ascending to assign new dates in order
        matchedFiles.sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));

        const startDate = new Date();

        for (let i = 0; i < matchedFiles.length; i++) {
            const { filename, dateStr, filePath } = matchedFiles[i];

            if (!isValidDate(dateStr)) {
                console.warn(`Skipping ${filename}: invalid date format.`);
                continue;
            }

            // Calculate new date by adding i days to startDate
            const newDate = formatDate(addDays(startDate, i));

            // Generate new filename by replacing old date with new date
            const newFilename = filename.replace(dateStr, newDate);

            if (newFilename === filename) {
                console.log(`File ${filename} already has the updated date.`);
                continue;
            }

            // Check if new filename already exists to avoid overwriting
            const newFilePath = path.join(directory, newFilename);
            try {
                await fs.access(newFilePath);
                console.warn(`Skipping rename for ${filename}: target file ${newFilename} already exists.`);
                continue;
            } catch {
                // No conflict, proceed to rename
            }

            await fs.rename(filePath, newFilePath);
            console.log(`Renamed: ${filePath} -> ${newFilePath}`);
        }

    } catch (error) {
        console.error('Error renaming files:', error);
    }
}

// Run the script on the current working directory
renameFilesInDirectory(process.cwd());
