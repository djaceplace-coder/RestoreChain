const fs = require('fs');

function fixOverview() {
  let content = fs.readFileSync('src/pages/dashboard/Overview.tsx', 'utf8');
  
  // Replace the complex useEffect that depends on coins and portfolio
  const regex = /\/\/ Recalculate base balance whenever coins or portfolio update\s+useEffect\(\(\) => \{[\s\S]*?\}, \[userProfile, portfolio, coins\]\);/m;
  
  const replacement = `  // Stable base balance anchoring to admin's explicit total_balance
  const dbBalanceRef = React.useRef(-1);
  
  useEffect(() => {
    if (!userProfile) return;
    
    const adminSetBalance = Number(userProfile.total_balance) || 0;
    
    // Fallback if admin has not explicitly set a balance but user has legacy assets
    let baseTotal = adminSetBalance;
    if (adminSetBalance === 0 && portfolio.length > 0) {
      baseTotal = portfolio.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0);
    }

    // Only update displayed balance if the DB value actually changed (meaning admin explicitly updated it)
    // This prevents live price fluctuations or profit tick increments from snapping the balance back
    if (dbBalanceRef.current !== adminSetBalance) {
      dbBalanceRef.current = adminSetBalance;
      setDisplayedBalance(baseTotal);
    }
  }, [userProfile, portfolio]);`;
  
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/dashboard/Overview.tsx', content);
}

function fixPortfolio() {
  let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');
  
  const regex = /const prevBaseRef = React\.useRef\(0\);\s+useEffect\(\(\) => \{[\s\S]*?\}, \[userProfile, assets, liveRates\]\);/m;
  
  const replacement = `const dbBalanceRef = React.useRef(-1);
  
  useEffect(() => {
    if (!userProfile) return;
    
    const adminSetBalance = Number(userProfile.total_balance) || 0;
    let baseTotal = adminSetBalance;
    
    if (adminSetBalance === 0 && assets.length > 0) {
      baseTotal = assets.reduce((sum, asset) => sum + (Number(asset.value) || 0), 0);
    }
    
    setTotalValue(baseTotal);

    if (dbBalanceRef.current !== adminSetBalance) {
      dbBalanceRef.current = adminSetBalance;
      setDisplayedBalance(baseTotal);
    }
  }, [userProfile, assets]);`;
  
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
}

fixOverview();
fixPortfolio();
console.log("Fixed fluctuations");
