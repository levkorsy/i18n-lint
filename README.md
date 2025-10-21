# i18n Hebrew Checker

A tool to check Hebrew translation files for untranslated strings.

## Installation

```bash
npm install -g i18n-hebrew-checker
```

## Usage

### Quick check (console only)
```bash
npm run check
# or
i18n-hebrew-checker
```

### Check and save results
```bash
npm run check:save
# or
i18n-hebrew-checker --save
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

## Features

- ✅ Detects untranslated strings in Hebrew translation files
- ✅ Configurable allowlist for technical terms
- ✅ Supports multiple files
- ✅ CI/CD friendly
- ✅ Zero dependencies

## License

MIT