const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

content = content.replace(
`    // Use the actual live total, bypassing the 5% lock which hid real deposits
    setDisplayedBalance(prev => {
      // Only set directly if we are initializing or if the difference is massive (like a real deposit)
      // Otherwise we let the growth engine handle the micro-ticks based on liveTotal
      // Wait, we WANT the main balance to update when admin credits. 
      // If we just return liveTotal, the profit_rate engine might jitter? 
      // Actually, if we just update it whenever liveTotal changes, it's fine.
      return liveTotal;
    });`,
`    setDisplayedBalance(prev => {
      if (prev === 0 || Math.abs(prev - liveTotal) > (liveTotal * 0.02)) {
        return liveTotal;
      }
      return prev;
    });`
);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
