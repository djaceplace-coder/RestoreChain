const fs = require('fs');

function replaceFile(path, oldText, newText) {
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(new RegExp(oldText, 'g'), newText);
  fs.writeFileSync(path, content);
}

replaceFile('src/pages/dashboard/Support.tsx', "neq\\('status', 'deleted'\\)", "neq('status', 'closed')");
replaceFile('src/pages/admin/AdminSupport.tsx', "neq\\('status', 'deleted'\\)", "neq('status', 'closed')");
replaceFile('src/pages/admin/AdminSupport.tsx', "update\\({ status: 'deleted' }\\)", "update({ status: 'closed' })");

console.log('Fixed enum issue');
