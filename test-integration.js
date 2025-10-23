#!/usr/bin/env node
import { exec } from 'child_process';
import { promisify } from 'util';
import assert from 'assert';

const execAsync = promisify(exec);

console.log('🔧 Running integration tests...\n');

try {
    // Test 1: CLI execution
    console.log('1️⃣ Testing CLI execution...');
    const { stdout, stderr } = await execAsync('node index.js');
    
    assert.ok(stdout.includes('Checking: test-translations/he.json (Hebrew)'), 'Should check Hebrew file');
    assert.ok(stdout.includes('Checking: test-translations/en.json (English)'), 'Should check English file');
    assert.ok(stdout.includes('Checking: test-translations/ru.json (Russian)'), 'Should check Russian file');
    assert.ok(stdout.includes('Found:'), 'Should find untranslated values');
    
    console.log('✅ CLI execution test passed\n');

    // Test 2: Save functionality
    console.log('2️⃣ Testing save functionality...');
    const { stdout: saveOutput } = await execAsync('node index.js --save');
    
    assert.ok(saveOutput.includes('Results saved to:'), 'Should save results when --save flag is used');
    
    console.log('✅ Save functionality test passed\n');

    console.log('🎉 All integration tests passed successfully!');

} catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
}