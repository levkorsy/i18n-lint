# i18n Quality Lint

A universal CLI tool to lint i18n translation files, detect untranslated strings, and sync keys across multiple languages.

## Installation

### Global installation
```bash
npm install -g i18n-quality-lint
```

### Project installation (recommended)
```bash
npm install --save-dev i18n-quality-lint
```

## Usage

### Quick check (console only)
```bash
# Global
i18n-quality-lint

# Project installation
npx i18n-quality-lint

# Or add to package.json scripts:
# "i18n:check": "i18n-quality-lint"
npm run i18n:check
```

### Check and save results
```bash
# Global
i18n-quality-lint --save

# Project installation
npx i18n-quality-lint --save

# Or add to package.json scripts:
# "i18n:check:save": "i18n-quality-lint --save"
npm run i18n:check:save
```

## Example Output

```bash
$ npx i18n-quality-lint

Checking: src/i18n/he.json (Hebrew)
Found: 2 untranslated values
  PASSWORD: "Password"
  CANCEL: "Cancel"

Checking: src/i18n/en.json (English)
Found: 1 untranslated values
  WELCOME: "ברוכים הבאים"

🔄 Checking key synchronization between files...
Found: 1 synchronization issues
  src/i18n/he.json:
    Missing keys (1):
      EXTRA_KEY
```

## Configuration

Create `.i18ncheckrc.json` in your project root:

```json
{
  "files": [
    {
      "path": "src/i18n/translations/he.json",
      "language": "hebrew",
      "ignoreKeys": ["BULK_ACTIONS"],
      "allowlist": ["AWS", "SSO", "JWT", "ID", "N/A", "API"]
    },
    {
      "path": "src/i18n/translations/en.json",
      "language": "english",
      "ignoreKeys": [],
      "allowlist": ["Google", "API"]
    },
    {
      "path": "src/i18n/translations/partial.json",
      "language": "french",
      "ignoreKeys": [],
      "allowlist": [],
      "excludeFromSync": true
    }
  ],
  "failOnFindings": true,
  "outputDir": "output"
}
```

### Configuration Options

- `files` - Array of file configuration objects
  - `path` - Path to translation file
  - `language` - Target language (see supported languages below)
  - `ignoreKeys` - Keys to skip for this file
  - `allowlist` - Allowed values for this file
  - `excludeFromSync` - Exclude this file from key synchronization checking (optional)
- `failOnFindings` - Exit with error code if issues found (useful for CI/CD)
- `outputDir` - Directory to save results

### Supported Languages

- `english`, `hebrew`, `arabic`, `russian`, `chinese`, `japanese`, `korean`
- `french`, `german`, `spanish`, `italian`, `portuguese`, `dutch`
- `polish`, `czech`, `thai`, `hindi`, `greek`

### Backward Compatibility

Old configuration format is still supported:
```json
{
  "files": ["src/i18n/he.json"],
  "ignoreKeys": ["BULK_ACTIONS"],
  "allowlist": ["AWS", "API"],
  "failOnFindings": true
}
```

## Example package.json scripts

```json
{
  "scripts": {
    "i18n:check": "i18n-quality-lint",
    "i18n:check:save": "i18n-quality-lint --save"
  },
  "devDependencies": {
    "i18n-quality-lint": "^1.2.0"
  }
}
```

## Features

- ✅ Detects untranslated strings in 18+ languages
- ✅ **Key synchronization checking** - finds missing/extra keys between files
- ✅ Individual configuration per file
- ✅ Configurable allowlist for technical terms
- ✅ Supports multiple files and languages
- ✅ Colored console output with issue highlighting
- ✅ CI/CD friendly with automated testing
- ✅ Zero dependencies
- ✅ Backward compatible
- ✅ Comprehensive test coverage

## Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests
npm run test:all
```

## License

MIT