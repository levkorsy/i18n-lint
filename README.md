# i18n Quality Lint

A lightweight CLI tool to lint i18n translation files and detect untranslated strings.

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
    "src/i18n/translations/he.json"
  ],
  "ignoreKeys": ["BULK_ACTIONS"],
  "allowlist": ["AWS", "SSO", "JWT", "ID", "N/A", "API", "Google"],
  "failOnFindings": true,
  "outputDir": "output"
}
```

### Configuration Options

- `files` - Array of translation files to check
- `ignoreKeys` - Keys to skip during checking
- `allowlist` - Values that are allowed (technical terms, abbreviations)
- `failOnFindings` - Exit with error code if issues found (useful for CI/CD)
- `outputDir` - Directory to save results

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

- ✅ Detects untranslated strings in Hebrew translation files
- ✅ Configurable allowlist for technical terms
- ✅ Supports multiple files
- ✅ CI/CD friendly
- ✅ Zero dependencies

## License

MIT