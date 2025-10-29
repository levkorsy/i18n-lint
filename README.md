# 🌍 i18n Quality Lint

[![npm version](https://badge.fury.io/js/i18n-quality-lint.svg)](https://www.npmjs.com/package/i18n-quality-lint)
[![Downloads](https://img.shields.io/npm/dm/i18n-quality-lint.svg)](https://www.npmjs.com/package/i18n-quality-lint)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The ultimate i18n quality linter** - Detect untranslated strings, sync keys, and maintain consistency across **60+ languages** (including Klingon! 🖖)

## ✨ What it does

🔍 **Translation Quality**
- Detects untranslated strings in 60+ languages
- Supports nested JSON structures
- Configurable allowlists for technical terms
- Individual settings per file

🔄 **Key Synchronization** 
- Finds missing/extra keys between files
- Optional key order checking
- Excludes files from sync when needed
- Smart reference file detection
- Manual key order synchronization tool

🎨 **Developer Experience**
- Colored console output with issue highlighting
- CI/CD friendly with exit codes
- Zero dependencies
- Comprehensive test coverage

## 🚀 Quick Start

```bash
# Install
npm install --save-dev i18n-quality-lint

# Create config
echo '{
  "files": [
    {
      "path": "src/i18n/en.json",
      "language": "english"
    },
    {
      "path": "src/i18n/es.json",
      "language": "spanish"
    }
  ]
}' > .i18ncheckrc.json

# Run check
npx i18n-quality-lint
```

## 📊 Example Output

```bash
$ npx i18n-quality-lint

Checking: src/i18n/es.json (Spanish)
Found: 2 untranslated values
  PASSWORD: "Password"           # ← English in Spanish file
  CANCEL: "Cancel"

Checking: src/i18n/en.json (English)  
Found: 1 untranslated values
  WELCOME: "Bienvenidos"         # ← Spanish in English file

🔄 Checking key synchronization between files...
Found: 2 synchronization issues
  src/i18n/es.json:
    Missing keys (1):
      EXTRA_KEY                   # ← Key exists in EN but not ES
    Key order issues (1):         # ← Optional: different key order
      Position 1: expected 'WELCOME', found 'LOGIN'
```

## ⚙️ Configuration

Create `.i18ncheckrc.json` in your project root:

### 📝 Basic Configuration
```json
{
  "files": [
    {
      "path": "src/i18n/en.json",
      "language": "english"
    },
    {
      "path": "src/i18n/es.json",
      "language": "spanish"
    }
  ]
}
```

### 🔧 Advanced Configuration
```json
{
  "files": [
    {
      "path": "src/i18n/en.json",
      "language": "english",
      "ignoreKeys": ["DEBUG_MODE", "ADMIN.SECRET_PANEL"],
      "allowlist": ["API", "JWT", "OAuth", "GitHub"]
    },
    {
      "path": "src/i18n/es.json",
      "language": "spanish",
      "ignoreKeys": ["BULK_ACTIONS"],
      "allowlist": ["AWS", "SSO", "ID"]
    },
    {
      "path": "src/i18n/partial.json",
      "language": "french",
      "excludeFromSync": true
    }
  ],
  "checkKeyOrder": true,
  "failOnFindings": true,
  "outputDir": "i18n-reports"
}
```

### 📝 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| **files** | `Array<FileConfig>` | `[]` | List of translation files to check |
| **checkKeyOrder** | `boolean` | `false` | Check if keys are in same order across files |
| **failOnFindings** | `boolean` | `false` | Exit with error code when issues found (CI/CD) |
| **outputDir** | `string` | `"output"` | Directory to save results with `--save` |

#### 📁 FileConfig Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| **path** | `string` | - | Path to translation file |
| **language** | `string` | - | Target language (see supported languages) |
| **ignoreKeys** | `string[]` | `[]` | Keys to skip (supports nested: `"PARENT.CHILD"`) |
| **allowlist** | `string[]` | `[]` | Values allowed in any language |
| **excludeFromSync** | `boolean` | `false` | Skip this file in synchronization checks |

## 🌍 Supported Languages (60+)

<details>
<summary><strong>🇪🇺 European Languages (25)</strong></summary>

`english` `french` `german` `spanish` `italian` `portuguese` `dutch` `polish` `czech` `hungarian` `romanian` `croatian` `slovenian` `slovak` `finnish` `swedish` `norwegian` `danish` `lithuanian` `latvian` `estonian` `turkish` `greek` `bulgarian` `ukrainian` `serbian`
</details>

<details>
<summary><strong>🇨🇳 Asian Languages (20)</strong></summary>

`chinese` `japanese` `korean` `thai` `vietnamese` `hindi` `bengali` `tamil` `telugu` `malayalam` `kannada` `gujarati` `punjabi` `marathi` `nepali` `sinhala` `burmese` `khmer` `lao` `malay` `indonesian`
</details>

<details>
<summary><strong>🌍 Middle Eastern & African (7)</strong></summary>

`hebrew` `arabic` `persian` `urdu` `georgian` `armenian` `amharic` `swahili`
</details>

<details>
<summary><strong>🚀 Fun & Fantasy Languages (9)</strong></summary>

`klingon` `elvish` `dothraki` `valyrian` `navi` `minion` `pirate` `yoda` `emoji`

*Because why not make i18n more fun?* 🎉
</details>

## 📦 Installation

```bash
# Project installation (recommended)
npm install --save-dev i18n-quality-lint

# Global installation
npm install -g i18n-quality-lint
```

## 💻 Usage

### Command Line
```bash
# Quick check (console output only)
npx i18n-quality-lint

# Check and save results to file
npx i18n-quality-lint --save

# Sync key order across files (manual operation)
npx i18n-sync-keys
```

### Package.json Scripts
```json
{
  "scripts": {
    "i18n:check": "i18n-quality-lint",
    "i18n:check:save": "i18n-quality-lint --save",
    "i18n:sync-keys": "i18n-sync-keys",
    "i18n:ci": "i18n-quality-lint --fail-on-findings"
  }
}
```

### CI/CD Integration
```yaml
# GitHub Actions example
- name: Check i18n quality
  run: npx i18n-quality-lint
```

## 💼 Use Cases

🏢 **Enterprise Projects**
- Multi-language applications with 10+ locales
- Ensure consistency across large translation teams
- Automated quality checks in CI/CD pipelines

👥 **Development Teams**
- Catch translation issues before production
- Maintain synchronized keys across all languages
- Standardize technical terms and abbreviations

🚀 **Open Source Projects**
- Community-driven translations
- Validate contributor submissions
- Maintain translation quality standards

## 🎆 Real-world Examples

### E-commerce Platform
```json
{
  "files": [
    { "path": "locales/en.json", "language": "english" },
    { "path": "locales/es.json", "language": "spanish" },
    { "path": "locales/fr.json", "language": "french" },
    { "path": "locales/de.json", "language": "german" }
  ],
  "checkKeyOrder": true,
  "failOnFindings": true
}
```

### SaaS Application
```json
{
  "files": [
    {
      "path": "src/i18n/en.json",
      "language": "english",
      "allowlist": ["API", "OAuth", "SaaS", "GitHub"]
    },
    {
      "path": "src/i18n/fr.json",
      "language": "french",
      "ignoreKeys": ["LEGAL.TERMS_OF_SERVICE"],
      "allowlist": ["API", "OAuth"]
    }
  ]
}
```

## 🔄 Key Order Synchronization

**NEW!** Separate tool to manually synchronize key order across translation files:

```bash
# Sync key order (uses first file as reference)
npx i18n-sync-keys
```

**Features:**
- Uses first file in config as reference for key order
- Preserves all values and extra keys
- Respects `excludeFromSync` setting
- Safe operation - only reorders, never deletes

**Example:**
```bash
# Before sync:
# en.json: {"WELCOME": "Welcome", "LOGIN": "Login"}
# es.json: {"LOGIN": "Iniciar", "WELCOME": "Bienvenido"}

# After sync:
# en.json: {"WELCOME": "Welcome", "LOGIN": "Login"} (unchanged)
# es.json: {"WELCOME": "Bienvenido", "LOGIN": "Iniciar"} (reordered)
```

## 🔧 Advanced Features

### Nested Key Support
```json
{
  "ignoreKeys": [
    "ADMIN.SECRET_PANEL",           // Ignore specific nested key
    "DEBUG",                        // Ignore entire section
    "LEGAL.TERMS.SECTION_1.CLAUSE_A" // Deep nesting support
  ]
}
```

### Key Order Checking
```json
{
  "checkKeyOrder": true  // Ensures consistent key order across files
}
```

### Selective Sync Exclusion
```json
{
  "files": [
    { "path": "main.json", "language": "english" },
    { 
      "path": "partial.json", 
      "language": "french",
      "excludeFromSync": true  // Skip sync checks for this file
    }
  ]
}
```

## ❓ FAQ

<details>
<summary><strong>How do I ignore technical terms like "API" or "OAuth"?</strong></summary>

Use the `allowlist` option:
```json
{
  "allowlist": ["API", "OAuth", "JWT", "GitHub", "npm"]
}
```
</details>

<details>
<summary><strong>Can I check only specific keys and ignore others?</strong></summary>

Yes, use `ignoreKeys` with support for nested paths:
```json
{
  "ignoreKeys": ["DEBUG_MODE", "ADMIN.SECRET_PANEL", "LEGAL.TERMS"]
}
```
</details>

<details>
<summary><strong>How do I integrate with CI/CD?</strong></summary>

Set `failOnFindings: true` and the tool will exit with code 1 when issues are found:
```json
{
  "failOnFindings": true
}
```
</details>

<details>
<summary><strong>Does it work with nested JSON structures?</strong></summary>

Yes! The tool fully supports nested objects and arrays in your translation files.
</details>

## 🔄 Backward Compatibility

Old configuration format is still supported:
```json
{
  "files": ["src/i18n/es.json"],
  "ignoreKeys": ["BULK_ACTIONS"],
  "allowlist": ["AWS", "API"]
}
```

## 🤖 AI Agents & LLM Integration

For AI agents and LLM integration, see [AI-README.md](AI-README.md) for structured documentation.

## 📊 Stats

- ✅ **60+ languages** supported
- ✅ **Zero dependencies** 
- ✅ **12 comprehensive tests**
- ✅ **CI/CD ready**
- ✅ **7.3kB package size**

## 📝 License

MIT © [Lev Korsunskyi](https://github.com/levkorsy)

---

<div align="center">

**Made with ❤️ for the i18n community**

[Report Bug](https://github.com/levkorsy/i18n-lint/issues) • [Request Feature](https://github.com/levkorsy/i18n-lint/issues) • [Contribute](https://github.com/levkorsy/i18n-lint/pulls)

</div>