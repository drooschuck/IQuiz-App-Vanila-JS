/**
 * Node.js script to rename files in the current directory, 
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

// Main async function to rename files
async function renameFiles() {
    try {
        const files = await fs.readdir(process.cwd());
        // Filter files that match pattern with date in filename e.g. Y9_Cs_2025-06-11.js
        const datePattern = /(\d{4}-\d{2}-\d{2})/;

        // Collect matching files and their dates
        const matchedFiles = files
            .map(filename => {
                const match = filename.match(datePattern);
                if (match && filename.endsWith('.js')) {
                    return { filename, dateStr: match[1] };
                }
                return null;
            })
            .filter(Boolean);

        if (matchedFiles.length === 0) {
            console.log('No matching files with date pattern found.');
            return;
        }

        // Sort files by their current date in filename ascending to assign new dates in order
        matchedFiles.sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));

        const startDate = new Date();

        for (let i = 0; i < matchedFiles.length; i++) {
            const { filename, dateStr } = matchedFiles[i];

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
            try {
                await fs.access(path.join(process.cwd(), newFilename));
                console.warn(`Skipping rename for ${filename}: target file ${newFilename} already exists.`);
                continue;
            } catch {
                // No conflict, proceed to rename
            }

            await fs.rename(path.join(process.cwd(), filename), path.join(process.cwd(), newFilename));
            console.log(`Renamed: ${filename} -> ${newFilename}`);
        }

    } catch (error) {
        console.error('Error renaming files:', error);
    }
}

// Run the script
renameFiles();

