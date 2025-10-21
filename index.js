#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const shouldSaveFile = process.argv.includes('--save');

try {
    const config = JSON.parse(await readFile(join(__dirname, '.i18ncheckrc.json'), 'utf8'));
    
    for (const filePath of config.files) {
        console.log(`Checking: ${filePath}`);
        const data = JSON.parse(await readFile(filePath, 'utf8'));
        const nonHebrewValues = findNonHebrewValues(data, config);
        
        if (Object.keys(nonHebrewValues).length > 0) {
            const totalNonHebrewValues = countNonHebrewValues(nonHebrewValues);
            console.log("Found:", totalNonHebrewValues);
            
            if (shouldSaveFile) {
                const currentDate = new Date().toISOString().split('T')[0];
                const outputPath = join(__dirname, config.outputDir, `nonHebrewValues_${currentDate}.json`);
                
                await writeFile(outputPath, JSON.stringify(nonHebrewValues, null, 2));
                console.log('The file has been saved!');
            }
            
            if (config.failOnFindings) {
                process.exit(1);
            }
        } else {
            console.log('No issues found!');
        }
    }
} catch (err) {
    console.error(err);
    process.exit(1);
}

function findNonHebrewValues(data, config) {
    const nonHebrewValues = {};
    for (const key in data) {
        const value = data[key];
        if (typeof value === 'string' && value !== '' && 
            !config.allowlist.includes(value) && 
            !isHebrew(value) && 
            !isAbbr(value) && 
            !isAbbrWithSpaces(value)) {
            nonHebrewValues[key] = value;
        } else if (typeof value === 'object' && value !== null && !config.ignoreKeys.includes(key)) {
            const nestedNonHebrewValues = findNonHebrewValues(value, config);
            if (Object.keys(nestedNonHebrewValues).length > 0) {
                nonHebrewValues[key] = nestedNonHebrewValues;
            }
        }
    }
    return nonHebrewValues;
}

function countNonHebrewValues(data) {
    let count = 0;
    for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            count += countNonHebrewValues(data[key]);
        } else {
            count += 1;
        }
    }
    return count;
}

function isHebrew(value) {
    // Regular expression to check for Hebrew characters
    const hebrewPattern = /[\u0590-\u05FF]/;
    return hebrewPattern.test(value);
}

function isAbbr(value) {
    // Regular expression to check for abbreviations (e.g., all uppercase letters)
    const abbrPattern = /^[A-Z]+$/;
    return abbrPattern.test(value);
}

function isAbbrWithSpaces(value) {
    // Check for abbreviations with spaces (e.g., "IMAP HOST")
    const abbrWithSpacesPattern = /^[A-Z\s]+$/;
    return abbrWithSpacesPattern.test(value);
}
