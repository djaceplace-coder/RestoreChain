const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// Fix Portfolio displayedBalance lock
content = content.replace(
`    setDisplayedBalance(prev => {
      if (prev === 0 || Math.abs(prev - liveTotal) > (liveTotal * 0.05)) {
        return liveTotal;
      }
      return prev;
    });`,
`    // Use the actual live total, bypassing the 5% lock which hid real deposits
    setDisplayedBalance(prev => {
      // Only set directly if we are initializing or if the difference is massive (like a real deposit)
      // Otherwise we let the growth engine handle the micro-ticks based on liveTotal
      // Wait, we WANT the main balance to update when admin credits. 
      // If we just return liveTotal, the profit_rate engine might jitter? 
      // Actually, if we just update it whenever liveTotal changes, it's fine.
      return liveTotal;
    });`
);

// Add missing portfolios table listener
content = content.replace(
`      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: \`id=eq.\${user.id}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets', filter: \`user_id=eq.\${user.id}\` }, fetchData)`,
`      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: \`id=eq.\${user.id}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios', filter: \`user_id=eq.\${user.id}\` }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assets', filter: \`user_id=eq.\${user.id}\` }, fetchData)`
);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
console.log('patched Portfolio');
