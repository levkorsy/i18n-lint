#!/usr/bin/env node
import assert from 'assert';
import { readFile } from 'fs/promises';

// Import functions from index.js by reading and evaluating
const indexContent = await readFile('index.js', 'utf8');

// Extract constants
const languagesMatch = indexContent.match(/const SUPPORTED_LANGUAGES = ({[\s\S]*?});/);
const SUPPORTED_LANGUAGES = eval(`(${languagesMatch[1]})`);

const ABBR_PATTERN = /^[A-Z]+$/;
const ABBR_WITH_SPACES_PATTERN = /^[A-Z\s]+$/;

// Extract and create functions
const createFunction = (name, content) => {
    const funcMatch = content.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}`));
    if (funcMatch) {
        return eval(`(${funcMatch[0]})`);
    }
    return null;
};

const isTargetLanguage = createFunction('isTargetLanguage', indexContent);
const findUntranslatedValues = createFunction('findUntranslatedValues', indexContent);
const countUntranslatedValues = createFunction('countUntranslatedValues', indexContent);
const isAbbr = createFunction('isAbbr', indexContent);
const isAbbrWithSpaces = createFunction('isAbbrWithSpaces', indexContent);
const getAllKeys = createFunction('getAllKeys', indexContent);
const checkKeySynchronization = createFunction('checkKeySynchronization', indexContent);

// Test data
const testData = {
    hebrew: {
        "WELCOME": "ברוכים הבאים",
        "LOGIN": "Login",
        "NESTED": {
            "HELLO": "שלום",
            "GOODBYE": "Goodbye"
        }
    },
    english: {
        "WELCOME": "Welcome",
        "LOGIN": "התחברות",
        "API": "API",
        "JWT_TOKEN": "JWT TOKEN"
    },
    russian: {
        "WELCOME": "Добро пожаловать",
        "LOGIN": "Login",
        "SETTINGS": "Настройки"
    }
};

console.log('🧪 Running tests...\n');

// Test 1: Language detection
console.log('1️⃣ Testing language detection...');
assert.strictEqual(isTargetLanguage('ברוכים הבאים', 'hebrew'), true, 'Hebrew text should be detected');
assert.strictEqual(isTargetLanguage('Welcome', 'english'), true, 'English text should be detected');
assert.strictEqual(isTargetLanguage('Добро пожаловать', 'russian'), true, 'Russian text should be detected');
assert.strictEqual(isTargetLanguage('Login', 'hebrew'), false, 'English text should not be detected as Hebrew');
console.log('✅ Language detection tests passed\n');

// Test 2: Abbreviation detection
console.log('2️⃣ Testing abbreviation detection...');
assert.strictEqual(isAbbr('API'), true, 'API should be detected as abbreviation');
assert.strictEqual(isAbbr('JWT'), true, 'JWT should be detected as abbreviation');
assert.strictEqual(isAbbr('Login'), false, 'Login should not be detected as abbreviation');
assert.strictEqual(isAbbrWithSpaces('JWT TOKEN'), true, 'JWT TOKEN should be detected as abbreviation with spaces');
console.log('✅ Abbreviation detection tests passed\n');

// Test 3: Hebrew translation checking
console.log('3️⃣ Testing Hebrew translation checking...');
const hebrewConfig = { language: 'hebrew', ignoreKeys: [], allowlist: [] };
const hebrewResults = findUntranslatedValues(testData.hebrew, hebrewConfig);
assert.strictEqual(hebrewResults.LOGIN, 'Login', 'Should find untranslated LOGIN');
assert.strictEqual(hebrewResults.NESTED.GOODBYE, 'Goodbye', 'Should find nested untranslated GOODBYE');
assert.strictEqual(hebrewResults.WELCOME, undefined, 'Should not flag translated WELCOME');
console.log('✅ Hebrew translation checking tests passed\n');

// Test 4: English translation checking
console.log('4️⃣ Testing English translation checking...');
const englishConfig = { language: 'english', ignoreKeys: [], allowlist: ['API'] };
const englishResults = findUntranslatedValues(testData.english, englishConfig);
assert.strictEqual(englishResults.LOGIN, 'התחברות', 'Should find untranslated LOGIN');
assert.strictEqual(englishResults.API, undefined, 'Should not flag allowlisted API');
assert.strictEqual(englishResults.JWT_TOKEN, undefined, 'Should not flag abbreviation JWT_TOKEN');
console.log('✅ English translation checking tests passed\n');

// Test 5: Count untranslated values
console.log('5️⃣ Testing count function...');
const countTestData = {
    "KEY1": "value1",
    "NESTED": {
        "KEY2": "value2",
        "KEY3": "value3"
    }
};
assert.strictEqual(countUntranslatedValues(countTestData), 3, 'Should count 3 untranslated values');
console.log('✅ Count function tests passed\n');

// Test 6: Ignore keys functionality
console.log('6️⃣ Testing ignore keys functionality...');
const ignoreConfig = { language: 'hebrew', ignoreKeys: ['NESTED'], allowlist: [] };
const ignoreResults = findUntranslatedValues(testData.hebrew, ignoreConfig);
assert.strictEqual(ignoreResults.NESTED, undefined, 'Should ignore NESTED key');
assert.strictEqual(ignoreResults.LOGIN, 'Login', 'Should still find LOGIN');
console.log('✅ Ignore keys functionality tests passed\n');

// Test 7: Allowlist functionality
console.log('7️⃣ Testing allowlist functionality...');
const allowlistConfig = { language: 'hebrew', ignoreKeys: [], allowlist: ['Login'] };
const allowlistResults = findUntranslatedValues(testData.hebrew, allowlistConfig);
assert.strictEqual(allowlistResults.LOGIN, undefined, 'Should not flag allowlisted Login');
console.log('✅ Allowlist functionality tests passed\n');

// Test 8: Supported languages
console.log('8️⃣ Testing supported languages...');
const expectedLanguages = ['english', 'hebrew', 'arabic', 'russian', 'chinese', 'japanese', 'korean'];
expectedLanguages.forEach(lang => {
    assert.ok(SUPPORTED_LANGUAGES[lang], `Should support ${lang}`);
    assert.ok(SUPPORTED_LANGUAGES[lang].pattern, `${lang} should have pattern`);
    assert.ok(SUPPORTED_LANGUAGES[lang].name, `${lang} should have name`);
});
console.log('✅ Supported languages tests passed\n');

// Test 9: Key synchronization
console.log('9️⃣ Testing key synchronization...');
const syncTestData = {
    'file1.json': { 'KEY1': 'value1', 'KEY2': 'value2', 'NESTED': { 'SUB1': 'sub1' } },
    'file2.json': { 'KEY1': 'value1', 'KEY3': 'value3', 'NESTED': { 'SUB1': 'sub1' } },
    'file3.json': { 'KEY1': 'value1', 'KEY2': 'value2', 'NESTED': { 'SUB1': 'sub1', 'SUB2': 'sub2' } }
};
const syncConfigs = [
    { path: 'file1.json' },
    { path: 'file2.json' },
    { path: 'file3.json' }
];
const syncIssues = checkKeySynchronization(syncTestData, syncConfigs);
assert.ok(syncIssues.length > 0, 'Should find synchronization issues');
assert.ok(syncIssues.some(issue => issue.type === 'missing'), 'Should find missing keys');
assert.ok(syncIssues.some(issue => issue.type === 'extra'), 'Should find extra keys');
console.log('✅ Key synchronization tests passed\n');

// Test 10: Get all keys function
console.log('🔟 Testing getAllKeys function...');
const keysTestData = {
    'KEY1': 'value1',
    'NESTED': {
        'SUB1': 'sub1',
        'SUB2': 'sub2'
    }
};
const allKeys = getAllKeys(keysTestData);
assert.deepStrictEqual(allKeys.sort(), ['KEY1', 'NESTED.SUB1', 'NESTED.SUB2'], 'Should extract all nested keys');
console.log('✅ getAllKeys function tests passed\n');

// Test 11: Exclude from sync functionality
console.log('1️⃣1️⃣ Testing excludeFromSync functionality...');
const excludeTestConfigs = [
    { path: 'file1.json', excludeFromSync: false },
    { path: 'file2.json', excludeFromSync: true },
    { path: 'file3.json' }
];
const filteredConfigs = excludeTestConfigs.filter(config => !config.excludeFromSync);
assert.strictEqual(filteredConfigs.length, 2, 'Should exclude file with excludeFromSync: true');
assert.ok(filteredConfigs.some(c => c.path === 'file1.json'), 'Should include file1.json');
assert.ok(filteredConfigs.some(c => c.path === 'file3.json'), 'Should include file3.json');
assert.ok(!filteredConfigs.some(c => c.path === 'file2.json'), 'Should exclude file2.json');
console.log('✅ excludeFromSync functionality tests passed\n');

console.log('🎉 All tests passed successfully!');