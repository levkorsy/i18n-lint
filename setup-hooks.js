#!/usr/bin/env node
import { writeFile, chmod } from 'fs/promises';
import { join } from 'path';

const preCommitHook = `#!/bin/sh
# Pre-commit hook to run tests

echo "Running tests before commit..."
npm run test:all

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Commit aborted."
  exit 1
fi

echo "✅ All tests passed! Proceeding with commit."
exit 0`;

try {
    const hookPath = join('.git', 'hooks', 'pre-commit');
    await writeFile(hookPath, preCommitHook);
    
    // Make executable on Unix systems
    try {
        await chmod(hookPath, '755');
    } catch (err) {
        // Ignore chmod errors on Windows
    }
    
    console.log('✅ Git hooks installed successfully!');
    console.log('Tests will now run automatically before each commit.');
} catch (error) {
    console.error('❌ Failed to install Git hooks:', error.message);
    process.exit(1);
}