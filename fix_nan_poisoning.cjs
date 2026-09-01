const fs = require('fs');

function fixFile(filePath) {
  let file = fs.readFileSync(filePath, 'utf8');
  file = file.replace(/\(asset\.value \/ \(Number\(asset\.balance\) \|\| 0\)\)/g, '(Number(asset.value || 0) / (Number(asset.balance) || 0))');
  fs.writeFileSync(filePath, file);
}

fixFile('src/pages/dashboard/Portfolio.tsx');
fixFile('src/pages/dashboard/Overview.tsx');

console.log('Fixed NaN poisoning');
