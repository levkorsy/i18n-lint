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
    greek: { pattern: /[\u0370-\u03FF]/, name: 'Greek' },
    turkish: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F\u011E\u011F\u0130\u0131\u015E\u015F]/, name: 'Turkish' },
    vietnamese: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u024F\u1E00-\u1EFF]/, name: 'Vietnamese' },
    bulgarian: { pattern: /[\u0400-\u04FF]/, name: 'Bulgarian' },
    ukrainian: { pattern: /[\u0400-\u04FF]/, name: 'Ukrainian' },
    serbian: { pattern: /[\u0400-\u04FF]/, name: 'Serbian' },
    croatian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Croatian' },
    slovenian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Slovenian' },
    slovak: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Slovak' },
    hungarian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Hungarian' },
    romanian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Romanian' },
    finnish: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Finnish' },
    swedish: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Swedish' },
    norwegian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Norwegian' },
    danish: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Danish' },
    lithuanian: { pattern: /[\u0041-\u005A\u0061-\u007A\u0100-\u017F]/, name: 'Lithuanian' },
    latvian: { pattern: /[\u0041-\u005A\u0061-\u007A\u0100-\u017F]/, name: 'Latvian' },
    estonian: { pattern: /[\u0041-\u005A\u0061-\u007A\u00C0-\u017F]/, name: 'Estonian' },
    persian: { pattern: /[\u0600-\u06FF]/, name: 'Persian' },
    urdu: { pattern: /[\u0600-\u06FF]/, name: 'Urdu' },
    bengali: { pattern: /[\u0980-\u09FF]/, name: 'Bengali' },
    tamil: { pattern: /[\u0B80-\u0BFF]/, name: 'Tamil' },
    telugu: { pattern: /[\u0C00-\u0C7F]/, name: 'Telugu' },
    malayalam: { pattern: /[\u0D00-\u0D7F]/, name: 'Malayalam' },
    kannada: { pattern: /[\u0C80-\u0CFF]/, name: 'Kannada' },
    gujarati: { pattern: /[\u0A80-\u0AFF]/, name: 'Gujarati' },
    punjabi: { pattern: /[\u0A00-\u0A7F]/, name: 'Punjabi' },
    marathi: { pattern: /[\u0900-\u097F]/, name: 'Marathi' },
    nepali: { pattern: /[\u0900-\u097F]/, name: 'Nepali' },
    sinhala: { pattern: /[\u0D80-\u0DFF]/, name: 'Sinhala' },
    burmese: { pattern: /[\u1000-\u109F]/, name: 'Burmese' },
    khmer: { pattern: /[\u1780-\u17FF]/, name: 'Khmer' },
    lao: { pattern: /[\u0E80-\u0EFF]/, name: 'Lao' },
    georgian: { pattern: /[\u10A0-\u10FF]/, name: 'Georgian' },
    armenian: { pattern: /[\u0530-\u058F]/, name: 'Armenian' },
    amharic: { pattern: /[\u1200-\u137F]/, name: 'Amharic' },
    swahili: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Swahili' },
    malay: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Malay' },
    indonesian: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Indonesian' },
    klingon: { pattern: /[\uF8D0-\uF8FF]/, name: 'Klingon' },
    elvish: { pattern: /[\u1E00-\u1EFF]/, name: 'Elvish (Sindarin)' },
    dothraki: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Dothraki' },
    valyrian: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'High Valyrian' },
    navi: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: "Na'vi" },
    minion: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Minionese' },
    pirate: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Pirate Speak' },
    yoda: { pattern: /[\u0041-\u005A\u0061-\u007A]/, name: 'Yoda Speak' },
    emoji: { pattern: /[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E0-\u1F1FF]/, name: 'Emoji' }
};

const ABBR_PATTERN = /^[A-Z]+$/;
const ABBR_WITH_SPACES_PATTERN = /^[A-Z\s]+$/;

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
    const allowlistSet = new Set(config.allowlist);
    const ignoreKeysSet = new Set(config.ignoreKeys);
    
    for (const key in data) {
        const value = data[key];
        if (typeof value === 'string' && value !== '' && 
            !allowlistSet.has(value) && 
            !isTargetLanguage(value, config.language) && 
            !isAbbr(value) && 
            !isAbbrWithSpaces(value)) {
            untranslatedValues[key] = value;
        } else if (typeof value === 'object' && value !== null && !ignoreKeysSet.has(key)) {
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
    return ABBR_PATTERN.test(value);
}

function isAbbrWithSpaces(value) {
    return ABBR_WITH_SPACES_PATTERN.test(value);
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
    const fileKeysSets = new Map();
    
    // Get all keys from each file as Sets
    for (const config of fileConfigs) {
        const filePath = config.path;
        const data = allData[filePath];
        fileKeysSets.set(filePath, new Set(getAllKeys(data)));
    }
    
    // Find reference file (file with most keys)
    let referenceFile = null;
    let maxKeys = 0;
    for (const [filePath, keysSet] of fileKeysSets) {
        if (keysSet.size > maxKeys) {
            maxKeys = keysSet.size;
            referenceFile = filePath;
        }
    }
    
    const referenceKeys = fileKeysSets.get(referenceFile);
    
    // Check each file against reference
    for (const [filePath, currentKeys] of fileKeysSets) {
        if (filePath === referenceFile) continue;
        
        // Find missing and extra keys
        for (const key of referenceKeys) {
            if (!currentKeys.has(key)) {
                issues.push({ type: 'missing', file: filePath, key });
            }
        }
        
        for (const key of currentKeys) {
            if (!referenceKeys.has(key)) {
                issues.push({ type: 'extra', file: filePath, key });
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
            for (const key of fileIssues.missing) {
                console.log(`      ${colors.yellow}${key}${colors.reset}`);
            }
        }
        
        if (fileIssues.extra.length > 0) {
            console.log(`    ${colors.red}Extra keys (${fileIssues.extra.length}):${colors.reset}`);
            for (const key of fileIssues.extra) {
                console.log(`      ${colors.yellow}${key}${colors.reset}`);
            }
        }
        console.log('');
    }
}
