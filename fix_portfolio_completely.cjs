const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// 1. Add userProfile state
content = content.replace(
  "const [user, setUser] = useState<any>(null);",
  "const [user, setUser] = useState<any>(null);\n  const [userProfile, setUserProfile] = useState<any>(null);"
);

// 2. Fetch the profile correctly and set userProfile
content = content.replace(
  "if (profile) setTotalValue(Number(profile.total_balance || 0));",
  "if (profile) {\n        setUserProfile(profile);\n        setTotalValue(Number(profile.total_balance || 0));\n        if (displayedBalance === 0) setDisplayedBalance(Number(profile.total_balance || 0));\n      }"
);
content = content.replace(
  ".select('total_balance')",
  ".select('*')"
);

// 3. Add the real-time balance growth effect and define displayGreeting before the early return
const returnLoadingRegex = /if \(loading\) return <div className="p-12 flex justify-center">/;
const newLogic = `
  useEffect(() => {
    if (!userProfile) return;
    const profitRate = Number(userProfile.profit_rate) || 0;
    if (profitRate <= 0) return;

    const interval = setInterval(() => {
      setDisplayedBalance(prev => {
        const incrementFactor = (profitRate / 100) * (Math.random() * 0.0001); 
        const minIncrement = prev > 0 ? 0.01 : 0;
        return prev + (prev * incrementFactor) + minIncrement;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [userProfile]);

  const greetingName = userProfile?.last_name || userProfile?.first_name || 'User';
  const displayGreeting = userProfile?.last_name ? \`Welcome, \${userProfile.last_name}\` : \`Hello, \${greetingName}\`;

  if (loading) return <div className="p-12 flex justify-center">`;

content = content.replace(returnLoadingRegex, newLogic);

// 4. Update the greeting usage in the JSX to use userProfile.profit_rate instead of user.profit_rate
content = content.replace(
  "Number(user?.profit_rate)",
  "Number(userProfile?.profit_rate)"
);
content = content.replace(
  "+\\${user?.profit_rate}%",
  "+${userProfile?.profit_rate}%"
);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
console.log('Portfolio.tsx completely fixed');
