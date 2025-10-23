#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SUPPORTED_LANGUAGES = {
    english: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'English' },
    hebrew: { pattern: /[\u0590-\u05FF]/, name: 'Hebrew' },
    arabic: { pattern: /[\u0600-\u06FF]/, name: 'Arabic' },
    russian: { pattern: /[\u0400-\u04FF]/, name: 'Russian' },
    chinese: { pattern: /[\u4e00-\u9fff]/, name: 'Chinese' },
    japanese: { pattern: /[\u3040-\u309F\u30A0-\u30FF\u4e00-\u9fff]/, name: 'Japanese' },
    korean: { pattern: /[\uAC00-\uD7AF]/, name: 'Korean' },
    french: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'French' },
    german: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'German' },
    spanish: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Spanish' },
    italian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Italian' },
    portuguese: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Portuguese' },
    dutch: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Dutch' },
    polish: { pattern: /[\u0041-\u005A\u0061-\u007A\u0100-\u017F]/, name: 'Polish' },
    czech: { pattern: /[\u0041-\u005A\u0061-\u007A\u0100-\u017F]/, name: 'Czech' },
    thai: { pattern: /[\u0E00-\u0E7F]/, name: 'Thai' },
    hindi: { pattern: /[\u0900-\u097F]/, name: 'Hindi' },
    greek: { pattern: /[\u0370-\u03FF]/, name: 'Greek' }
};

const shouldSaveFile = process.argv.includes('--save');

try {
    const config = JSON.parse(await readFile('.i18ncheckrc.json', 'utf8'));
    const allFindings = {};
    const allTranslationData = {};
    let totalIssues = 0;
    
    // Support both old and new config formats
    const filesToCheck = Array.isArray(config.files) && typeof config.files[0] === 'object' 
        ? config.files 
        : config.files.map(path => ({ 
            path, 
            language: 'hebrew', 
            ignoreKeys: config.ignoreKeys || [], 
            allowlist: config.allowlist || [] 
          }));
    
    for (const fileConfig of filesToCheck) {
        const { path: filePath, language, ignoreKeys = [], allowlist = [] } = fileConfig;
        
        if (!SUPPORTED_LANGUAGES[language]) {
            console.error(`Unsupported language: ${language}`);
            continue;
        }
        
        console.log(`Checking: ${filePath} (${SUPPORTED_LANGUAGES[language].name})`);
        const data = JSON.parse(await readFile(filePath, 'utf8'));
        allTranslationData[filePath] = data;
        const untranslatedValues = findUntranslatedValues(data, { language, ignoreKeys, allowlist });
        
        if (Object.keys(untranslatedValues).length > 0) {
            const count = countUntranslatedValues(untranslatedValues);
            console.log(`Found: ${count} untranslated values`);
            
            displayUntranslatedValues(untranslatedValues);
            allFindings[filePath] = untranslatedValues;
            totalIssues += count;
        } else {
            console.log('No issues found!');
        }
        console.log('');
    }
    
    // Check key synchronization between files
    const syncFiles = filesToCheck.filter(config => !config.excludeFromSync);
    if (syncFiles.length > 1) {
        console.log('🔄 Checking key synchronization between files...');
        const excludedFiles = filesToCheck.filter(config => config.excludeFromSync);
        if (excludedFiles.length > 0) {
            console.log(`ℹ️  Excluded from sync: ${excludedFiles.map(f => f.path).join(', ')}`);
        }
        const syncIssues = checkKeySynchronization(allTranslationData, syncFiles);
        if (syncIssues.length > 0) {
            console.log(`Found: ${syncIssues.length} synchronization issues`);
            displaySyncIssues(syncIssues);
            totalIssues += syncIssues.length;
        } else {
            console.log('✅ All files have synchronized keys!');
        }
        console.log('');
    }
    
    if (shouldSaveFile && totalIssues > 0) {
        const currentDate = new Date().toISOString().split('T')[0];
        const outputPath = join(config.outputDir || 'output', `untranslatedValues_${currentDate}.json`);
        
        await writeFile(outputPath, JSON.stringify(allFindings, null, 2));
        console.log('Results saved to:', outputPath);
    }
    
    if (config.failOnFindings && totalIssues > 0) {
        process.exit(1);
    }
} catch (err) {
    console.error(err);
    process.exit(1);
}

function findUntranslatedValues(data, config) {
    const untranslatedValues = {};
    for (const key in data) {
        const value = data[key];
        if (typeof value === 'string' && value !== '' && 
            !config.allowlist.includes(value) && 
            !isTargetLanguage(value, config.language) && 
            !isAbbr(value) && 
            !isAbbrWithSpaces(value)) {
            untranslatedValues[key] = value;
        } else if (typeof value === 'object' && value !== null && !config.ignoreKeys.includes(key)) {
            const nestedUntranslatedValues = findUntranslatedValues(value, config);
            if (Object.keys(nestedUntranslatedValues).length > 0) {
                untranslatedValues[key] = nestedUntranslatedValues;
            }
        }
    }
    return untranslatedValues;
}

function countUntranslatedValues(data) {
    let count = 0;
    for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            count += countUntranslatedValues(data[key]);
        } else {
            count += 1;
        }
    }
    return count;
}

function isTargetLanguage(value, language) {
    const languageConfig = SUPPORTED_LANGUAGES[language];
    if (!languageConfig) return false;
    return languageConfig.pattern.test(value);
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

function displayUntranslatedValues(data, prefix = '') {
    const colors = {
        red: '\x1b[31m',
        yellow: '\x1b[33m',
        reset: '\x1b[0m'
    };
    
    for (const key in data) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof data[key] === 'object' && data[key] !== null) {
            displayUntranslatedValues(data[key], fullKey);
        } else {
            console.log(`  ${colors.yellow}${fullKey}${colors.reset}: ${colors.red}"${data[key]}"${colors.reset}`);
        }
    }
}

function getAllKeys(obj, prefix = '') {
    const keys = [];
    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys.push(...getAllKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

function checkKeySynchronization(allData, fileConfigs) {
    const issues = [];
    const fileKeys = {};
    
    // Get all keys from each file
    for (const config of fileConfigs) {
        const filePath = config.path;
        const data = allData[filePath];
        fileKeys[filePath] = getAllKeys(data);
    }
    
    // Find reference file (first file or file with most keys)
    const filePaths = Object.keys(fileKeys);
    const referenceFile = filePaths.reduce((ref, current) => 
        fileKeys[current].length > fileKeys[ref].length ? current : ref
    );
    const referenceKeys = new Set(fileKeys[referenceFile]);
    
    // Check each file against reference
    for (const filePath of filePaths) {
        if (filePath === referenceFile) continue;
        
        const currentKeys = new Set(fileKeys[filePath]);
        
        // Find missing keys
        for (const key of referenceKeys) {
            if (!currentKeys.has(key)) {
                issues.push({
                    type: 'missing',
                    file: filePath,
                    key: key,
                    reference: referenceFile
                });
            }
        }
        
        // Find extra keys
        for (const key of currentKeys) {
            if (!referenceKeys.has(key)) {
                issues.push({
                    type: 'extra',
                    file: filePath,
                    key: key,
                    reference: referenceFile
                });
            }
        }
    }
    
    return issues;
}

function displaySyncIssues(issues) {
    const colors = {
        red: '\x1b[31m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        reset: '\x1b[0m'
    };
    
    const groupedIssues = issues.reduce((acc, issue) => {
        if (!acc[issue.file]) acc[issue.file] = { missing: [], extra: [] };
        acc[issue.file][issue.type].push(issue.key);
        return acc;
    }, {});
    
    for (const [filePath, fileIssues] of Object.entries(groupedIssues)) {
        console.log(`  ${colors.blue}${filePath}${colors.reset}:`);
        
        if (fileIssues.missing.length > 0) {
            console.log(`    ${colors.red}Missing keys (${fileIssues.missing.length}):${colors.reset}`);
            fileIssues.missing.forEach(key => {
                console.log(`      ${colors.yellow}${key}${colors.reset}`);
            });
        }
        
        if (fileIssues.extra.length > 0) {
            console.log(`    ${colors.red}Extra keys (${fileIssues.extra.length}):${colors.reset}`);
            fileIssues.extra.forEach(key => {
                console.log(`      ${colors.yellow}${key}${colors.reset}`);
            });
        }
        console.log('');
    }
}
