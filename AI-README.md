# i18n-quality-lint - AI Agent Guide

## Quick Summary
Universal CLI tool for i18n quality checking: detects untranslated strings and synchronizes keys across 18+ languages.

## Core Capabilities
- **Translation Validation**: Finds untranslated strings in translation files
- **Key Synchronization**: Detects missing/extra keys between language files
- **Key Order Checking**: Optional validation of key order consistency  
- **Multi-language Support**: 60+ languages (Hebrew, Arabic, Chinese, Russian, Klingon, etc.)
- **Flexible Configuration**: Per-file settings, allowlists, ignore patterns, nested key support

## Installation & Usage
```bash
npm install --save-dev i18n-quality-lint
npx i18n-quality-lint
```

## Configuration Schema
```json
{
  "files": [
    {
      "path": "src/i18n/es.json",
      "language": "spanish",
      "ignoreKeys": ["BULK_ACTIONS", "NESTED.KEY.PATH"],
      "allowlist": ["API", "JWT"],
      "excludeFromSync": false
    }
  ],
  "checkKeyOrder": false,
  "failOnFindings": true,
  "outputDir": "output"
}
```

## Supported Languages
60+ languages including: `english`, `hebrew`, `arabic`, `russian`, `chinese`, `japanese`, `korean`, `french`, `german`, `spanish`, `italian`, `portuguese`, `dutch`, `polish`, `czech`, `thai`, `hindi`, `greek`, `turkish`, `vietnamese`, `bulgarian`, `ukrainian`, `serbian`, `croatian`, `hungarian`, `romanian`, `finnish`, `swedish`, `norwegian`, `danish`, `bengali`, `tamil`, `telugu`, `persian`, `urdu`, `georgian`, `armenian`, `amharic`, `swahili`, `malay`, `indonesian`, and even fun languages like `klingon`, `elvish`, `dothraki`, `valyrian`, `navi`, `minion`, `pirate`, `yoda`, `emoji`.

## Output Format
- Console: Colored output with file paths and issue details
- File: JSON format with structured findings
- Exit codes: 0 (success), 1 (issues found)

## Use Cases
1. **CI/CD Integration**: Automated translation quality checks
2. **Development Workflow**: Pre-commit hooks for translation validation
3. **Multi-team Projects**: Ensure translation consistency across teams
4. **Localization QA**: Systematic review of translation completeness

## API Integration
CLI tool only - no programmatic API. Use child_process to integrate:
```javascript
const { exec } = require('child_process');
exec('npx i18n-quality-lint', (error, stdout, stderr) => {
  // Handle results
});
```

## Performance
- Fast: Uses Set-based lookups (O(1))
- Memory efficient: Streams large files
- Scalable: Handles hundreds of translation files

## Dependencies
Zero runtime dependencies - pure Node.js implementation.