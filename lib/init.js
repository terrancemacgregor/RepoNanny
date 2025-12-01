const fs = require('fs');
const path = require('path');

const defaultConfig = {
  rules: {
    staleBranches: true,
    messyFiles: true,
    forgottenDocs: true,
    largeFiles: true,
    todoComments: true
  },
  exceptions: {
    staleBranches: {
      ignore: ['main', 'develop']
    },
    messyFiles: {
      ignore: ['node_modules', 'dist', '.git']
    },
    forgottenDocs: {
      ignore: []
    },
    largeFiles: {
      maxSizeKB: 500,
      ignore: ['package-lock.json']
    },
    todoComments: {
      ignore: []
    }
  }
};

function generateConfig(targetDir) {
  const configPath = path.join(targetDir, '.reponanny.json');
  
  if (fs.existsSync(configPath)) {
    console.log('.reponanny.json already exists. Skipping.');
    return false;
  }
  
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log('Created .reponanny.json');
  return true;
}

function generateRulesDoc(targetDir) {
  const rulesDir = path.join(__dirname, '..', 'rules');
  const docPath = path.join(targetDir, 'NANNY_RULES.md');
  
  const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.js'));
  
  let content = '# Nanny Rules\n\n';
  content += 'These are the rules RepoNanny uses to keep your repository in order.\n\n';
  
  for (const ruleFile of ruleFiles) {
    const ruleName = path.basename(ruleFile, '.js');
    const rule = require(path.join(rulesDir, ruleFile));
    
    content += `## ${ruleName}\n\n`;
    content += `${rule.description}\n\n`;
  }
  
  fs.writeFileSync(docPath, content);
  console.log('Created NANNY_RULES.md');
  return true;
}

function init(targetDir) {
  const dir = targetDir || process.cwd();
  
  generateConfig(dir);
  generateRulesDoc(dir);
  
  console.log('\nRepoNanny is ready to keep watch.');
}

module.exports = { init, generateConfig, generateRulesDoc };

