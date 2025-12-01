const fs = require('fs');
const path = require('path');

const description = 'Detects untracked files, temporary files, and other clutter that should be cleaned up or added to .gitignore.';

function check() {
  // TODO: Implement messy file detection
  return [];
}

function fix(issues, exceptions) {
  let fixedCount = 0;
  const docsDir = path.join(process.cwd(), 'docs');
  
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  for (const issue of issues) {
    if (issue.type === 'misplaced-markdown') {
      const sourcePath = issue.filePath;
      const fileName = path.basename(sourcePath);
      const destPath = path.join(docsDir, fileName);
      
      try {
        fs.renameSync(sourcePath, destPath);
        fixedCount++;
      } catch (err) {
        // Could not move file
      }
    }
  }
  
  return fixedCount;
}

module.exports = { check, description, fix };

