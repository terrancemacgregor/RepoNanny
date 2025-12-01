const fs = require('fs');
const path = require('path');

function loadConfig(configPath) {
  const fullPath = configPath || path.join(process.cwd(), '.reponanny.json');
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const configContent = fs.readFileSync(fullPath, 'utf8');
  return JSON.parse(configContent);
}

function loadRule(ruleName) {
  const rulePath = path.join(__dirname, '..', 'rules', `${ruleName}.js`);
  
  if (!fs.existsSync(rulePath)) {
    return null;
  }
  
  return require(rulePath);
}

function runRules(config, options = {}) {
  const results = [];
  const enabledRules = config.rules || {};
  const exceptions = config.exceptions || {};
  const fixMode = options.fix || false;

  for (const [ruleName, isEnabled] of Object.entries(enabledRules)) {
    if (!isEnabled) {
      continue;
    }

    const rule = loadRule(ruleName);
    
    if (!rule) {
      results.push({
        rule: ruleName,
        status: 'error',
        message: `Rule "${ruleName}" not found.`
      });
      continue;
    }

    const ruleExceptions = exceptions[ruleName] || {};
    
    try {
      const issues = rule.check(ruleExceptions);
      
      if (issues.length === 0) {
        results.push({
          rule: ruleName,
          status: 'pass',
          description: rule.description,
          message: 'All clear, nothing to scold here.'
        });
      } else {
        let fixed = 0;
        
        if (fixMode && typeof rule.fix === 'function') {
          fixed = rule.fix(issues, ruleExceptions);
        }
        
        results.push({
          rule: ruleName,
          status: 'fail',
          description: rule.description,
          message: `Found ${issues.length} issue(s).`,
          issues: issues,
          fixable: typeof rule.fix === 'function',
          fixed: fixed
        });
      }
    } catch (err) {
      results.push({
        rule: ruleName,
        status: 'error',
        description: rule.description,
        message: `Error running rule: ${err.message}`
      });
    }
  }

  return results;
}

module.exports = { loadConfig, loadRule, runRules };

