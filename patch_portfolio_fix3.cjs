const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// Find the start of the useEffect for calculating base balance
content = content.replace(
/  useEffect\(\(\) => {\n    if \(!userProfile\) return;\n    const fiat = Number\(userProfile\.fiat_balance \|\| 0\);/g,
`  const prevBaseRef = React.useRef(0);
  
  useEffect(() => {
    if (!userProfile) return;
    const fiat = Number(userProfile.fiat_balance || 0);`
);

content = content.replace(
/    setDisplayedBalance\(prev => {[\s\S]*?return prev;\n    }\);/g,
`    // Compute a purely structural base value to detect real admin/user deposits (ignoring price fluctuations)
    const structuralBase = fiat + assets.reduce((sum, a) => sum + Number(a.balance || 0), 0);
    
    setDisplayedBalance(prev => {
      // If the structural base has changed (meaning real assets were added/removed), force update
      if (prevBaseRef.current !== structuralBase) {
        prevBaseRef.current = structuralBase;
        return liveTotal;
      }
      
      // Otherwise, only update if the liveTotal deviates by more than 5% (to preserve fake growth ticks)
      if (prev === 0 || Math.abs(prev - liveTotal) > (liveTotal * 0.05)) {
        return liveTotal;
      }
      
      return prev;
    });`
);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
