#!/usr/bin/env node

const { loadConfig, runRules } = require('../lib/ruleRunner');
const { init } = require('../lib/init');

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const initMode = args.includes('--init');
const helpMode = args.includes('--help') || args.includes('-h');

if (helpMode) {
  console.log(`
RepoNanny - A stern British nanny for your codebase

Usage:
  reponanny [options]

Options:
  --init    Generate a .reponanny.json config file and NANNY_RULES.md
  --fix     Automatically correct fixable issues
  --help    Display this help message

Examples:
  reponanny              Run all enabled checks
  reponanny --fix        Run checks and fix issues automatically
  reponanny --init       Initialize RepoNanny in current directory

Exit Codes:
  0  All checks passed
  1  One or more checks failed
`);
  process.exit(0);
}

if (initMode) {
  init();
  process.exit(0);
}

console.log('RepoNanny is watching...\n');

const config = loadConfig();

if (!config) {
  console.log('No .reponanny.json config found. Nothing to check.');
  process.exit(0);
}

const results = runRules(config, { fix: fixMode });

let hasFailures = false;

for (const result of results) {
  if (result.status === 'pass') {
    console.log(`✓ ${result.rule}: ${result.message}`);
  } else if (result.status === 'fail') {
    hasFailures = true;
    console.log(`✗ ${result.rule}: ${result.message}`);
    if (result.fixed > 0) {
      console.log(`  └─ Fixed ${result.fixed} issue(s)`);
    }
  } else if (result.status === 'error') {
    hasFailures = true;
    console.log(`⚠ ${result.rule}: ${result.message}`);
  }
}

console.log('');

if (hasFailures) {
  console.log('RepoNanny is not pleased.');
  process.exit(1);
} else {
  console.log('RepoNanny approves. Carry on.');
  process.exit(0);
}

