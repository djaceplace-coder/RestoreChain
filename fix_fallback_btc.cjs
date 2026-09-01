const fs = require('fs');

function fixFile(file, btcVar) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /userPortfolios = \[\{ symbol: 'FIAT', balance: 1, value: profile\.total_balance, name: 'Portfolio Balance' \}\];/g,
    `userPortfolios = [{ symbol: 'BTC', balance: profile.total_balance / (${btcVar} || 77905), value: profile.total_balance, name: 'Bitcoin' }];`
  );
  fs.writeFileSync(file, content);
}

fixFile('src/pages/dashboard/Overview.tsx', 'btcPrice');
fixFile('src/pages/dashboard/Portfolio.tsx', 'btcPrice');
console.log("Fixed fallback BTC");
