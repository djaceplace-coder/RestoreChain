const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// Instead of recalculating liveValue from livePrice (which causes shakiness)
// We just use asset.value directly if it exists, otherwise calculate it.
content = content.replace(
  /const liveValue = livePrice \* \(Number\(asset\.balance\) \|\| 0\);/g,
  "const liveValue = Number(asset.value) || (livePrice * (Number(asset.balance) || 0));"
);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
console.log("Fixed asset shaking");
