const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /userPortfolios = \[\{ symbol: 'BTC', balance: profile\.total_balance \/ 70000, value: profile\.total_balance \}\];/g,
    "userPortfolios = [{ symbol: 'BTC', balance: profile.total_balance / (btcPrice || 77905), value: profile.total_balance }];"
  );
  
  // Wait, btcPrice might not be in scope for the fetchUser function! 
  // Let's just use a window variable or fetch it from the coins array.
  content = content.replace(
    /profile\.total_balance \/ \(btcPrice \|\| 77905\)/g,
    "profile.total_balance / (coins?.find(c => c.symbol==='BTC')?.price || 77905)"
  );
  fs.writeFileSync(file, content);
}

fixFile('src/pages/dashboard/Overview.tsx');
fixFile('src/pages/dashboard/Portfolio.tsx');
console.log("Improved fallback");
