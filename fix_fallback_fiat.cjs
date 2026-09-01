const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /userPortfolios = \[\{ symbol: 'BTC', balance: profile\.total_balance \/ \(coins\?\.find\(c => c\.symbol==='BTC'\)\?\.price \|\| 77905\), value: profile\.total_balance \}\];/g,
    "userPortfolios = [{ symbol: 'FIAT', balance: 1, value: profile.total_balance, name: 'Portfolio Balance' }];"
  );
  fs.writeFileSync(file, content);
}

fixFile('src/pages/dashboard/Overview.tsx');
fixFile('src/pages/dashboard/Portfolio.tsx');
console.log("Fixed fallback FIAT");
