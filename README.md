# RepoNanny

RepoNanny is a CLI tool that scolds your repo when it misbehaves—stale branches, messy files, forgotten docs, you name it. Think of it as a stern British nanny for your codebase, minus the umbrella and singing.

## Installation

```bash
npm install -g reponanny
```

Or install locally in your project:

```bash
npm install --save-dev reponanny
```

## Quick Start

Initialize RepoNanny in your project:

```bash
reponanny --init
```

This creates a `.reponanny.json` config file and `NANNY_RULES.md` documentation.

## Usage

Run all enabled checks:

```bash
reponanny
```

Run checks and automatically fix issues:

```bash
reponanny --fix
```

Display help:

```bash
reponanny --help
```

## Configuration

RepoNanny uses a `.reponanny.json` file in your project root. You can enable or disable rules and configure exceptions for each.

```json
{
  "rules": {
    "staleBranches": true,
    "messyFiles": true,
    "forgottenDocs": true,
    "largeFiles": true,
    "todoComments": true
  },
  "exceptions": {
    "staleBranches": {
      "ignore": ["main", "develop"]
    },
    "largeFiles": {
      "maxSizeKB": 500,
      "ignore": ["package-lock.json"]
    }
  }
}
```

## Available Rules

### staleBranches
Identifies branches that have not been updated in over 30 days and may need attention or cleanup.

### messyFiles
Detects untracked files, temporary files, and other clutter that should be cleaned up or added to .gitignore.

### forgottenDocs
Checks for missing or outdated documentation files like README, CHANGELOG, or LICENSE.

### largeFiles
Finds files that exceed the configured size limit and may bloat your repository.

### todoComments
Scans for TODO, FIXME, and HACK comments that have been left unresolved in the codebase.

## CI/CD Integration

RepoNanny returns proper exit codes for pipeline integration:
- Exit code 0: All checks passed
- Exit code 1: One or more checks failed

Example GitHub Actions usage:

```yaml
- name: Run RepoNanny
  run: npx reponanny
```

## License

ISC

