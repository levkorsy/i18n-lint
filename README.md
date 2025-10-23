# i18n Quality Lint

A universal CLI tool to lint i18n translation files and detect untranslated strings in multiple languages.

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
    "i18n-quality-lint": "^1.0.1"
  }
}
```

## Features

- ✅ Detects untranslated strings in 18+ languages
- ✅ Individual configuration per file
- ✅ Configurable allowlist for technical terms
- ✅ Supports multiple files and languages
- ✅ Colored console output
- ✅ CI/CD friendly
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