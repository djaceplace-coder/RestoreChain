const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// We will use standard string replacements to rewrite parts of Portfolio.tsx

// 1. Add states for Active Tab
content = content.replace(
  `const [loading, setLoading] = useState(true);`,
  `const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assets'>('overview');
  const [displayedBalance, setDisplayedBalance] = useState(0);`
);

// 2. Modify fetchUser to set displayedBalance and setup real-time tick
const useEffectUserRegex = /const fetchUser = async \(\) => \{[\s\S]*?setLoading\(false\);\n    \};/;

const newFetchUser = `const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setUser(profile); // We'll store profile in user state to access name & profit_rate easily
          setDisplayedBalance(Number(profile.total_balance) || 0);
          setTotalValue(Number(profile.total_balance) || 0); // fallback
        }
      }
      setLoading(false);
    };`;
content = content.replace(useEffectUserRegex, newFetchUser);

// 3. Add real-time interval effect for balance growth
const initDataRegex = /const initializeData = async \(\) => \{/;
const newInitData = `// Real-time balance growth effect
  useEffect(() => {
    if (!user) return;
    const profitRate = Number(user.profit_rate) || 0;
    if (profitRate <= 0) return;

    // Simulate growth
    const interval = setInterval(() => {
      setDisplayedBalance(prev => {
        const incrementFactor = (profitRate / 100) * (Math.random() * 0.0001); 
        const minIncrement = prev > 0 ? 0.01 : 0;
        return prev + (prev * incrementFactor) + minIncrement;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

  const greetingName = user?.last_name || user?.first_name || 'User';
  const displayGreeting = user?.last_name ? \`Welcome, \${user.last_name}\` : \`Hello, \${greetingName}\`;

  const initializeData = async () => {`;
content = content.replace(initDataRegex, newInitData);

// 4. Update Header and Balance section to include greeting and tabs
// We want to replace from `<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">` down to `</div>      {/* Action Buttons */}` 
const headerRegex = /<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">[\s\S]*?<\/div>\s*\{?\/\* Action Buttons \*\/\}?/;

const newHeader = `
      {/* Dynamic Greeting */}
      <h1 className="text-3xl font-display font-bold text-brand-dark mb-6">{displayGreeting}</h1>
      
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('overview')}
          className={\`pb-4 text-sm font-bold transition-colors relative \${activeTab === 'overview' ? 'text-brand-purple' : 'text-gray-500 hover:text-gray-700'}\`}
        >
          Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('assets')}
          className={\`pb-4 text-sm font-bold transition-colors relative \${activeTab === 'assets' ? 'text-brand-purple' : 'text-gray-500 hover:text-gray-700'}\`}
        >
          Assets
          {activeTab === 'assets' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-purple rounded-t-full"></div>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Balance</h1>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-brand-purple transition-colors"
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
              <ShieldCheck size={12} /> High Confidence
            </span>
          </div>
          <div className="text-3xl md:text-5xl font-display font-bold text-brand-dark">
            {showBalance ? \`$\${displayedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '••••••••'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            {Number(user?.profit_rate) > 0 ? (
               <span className="flex items-center text-sm font-bold text-green-500">
                 <ArrowUpRight size={16} /> +\${user?.profit_rate}% Active Growth
               </span>
            ) : (
               <span className="flex items-center text-sm font-bold text-green-500">
                 <ArrowUpRight size={16} /> $0.00 (0.0%)
               </span>
            )}
            <span className="text-sm text-gray-500">Live Updating</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}`;
content = content.replace(headerRegex, newHeader);

// 5. Update Action Buttons to remove "Add Asset" since it will go to the Assets tab
const actionButtonsRegex = /<button onClick=\{\(\) => setIsAddAssetOpen\(true\)\} className="p-4 bg-white border border-gray-200 text-brand-dark rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm group">[\s\S]*?<\/button>/;
// We'll just remove the Add Asset button from the top quick actions
content = content.replace(actionButtonsRegex, "");
// Oh wait, if it was grid-cols-3, we should change it to grid-cols-2
content = content.replace(/<div className="grid grid-cols-3 gap-4 mb-8">/, `<div className="grid grid-cols-2 gap-4 mb-8">`);


// 6. Split the main body into conditional tab renders
// Look for `<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">`
const mainGridRegex = /<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">([\s\S]*?)<\/div>\s*<\/div>\s*\);\s*\}\s*\/\//;

const oldMainGridMatch = content.match(mainGridRegex);
if (oldMainGridMatch) {
   const oldMainGridInner = oldMainGridMatch[1];
   // We will wrap the old body for "assets" tab. 
   // For "overview" tab, we will show the full 100+ coin list.
   
   const newTabContent = `
      {activeTab === 'overview' ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-brand-dark">Supported Crypto Assets</h2>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-2">
            {COINS.map(coin => (
              <div key={coin.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-600">
                    {coin.symbol.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-brand-dark text-md">{coin.name}</p>
                    <p className="text-xs text-gray-500">{coin.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-dark text-md">\$\${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</p>
                  <div className={\`text-xs font-bold flex items-center justify-end gap-1 \${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}\`}>
                    {coin.change24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(coin.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold font-display text-brand-dark">Your Assets</h2>
                <button 
                  onClick={() => setIsAddAssetOpen(true)}
                  className="bg-brand-dark text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors"
                >
                  <Plus size={16} /> Add Asset
                </button>
              </div>
              <div className="overflow-x-auto">
                {assets.length === 0 ? ( 
                   <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                     <Wallet size={48} className="text-gray-300 mb-4" />
                     <p>No assets found. Click 'Add Asset' to start building your portfolio.</p>
                   </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Asset</th>
                        <th className="px-6 py-4 font-medium text-right">Balance</th>
                        <th className="px-6 py-4 font-medium text-right">Price</th>
                        <th className="px-6 py-4 font-medium text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={\`w-10 h-10 rounded-full \${asset.color || 'bg-blue-500'} flex items-center justify-center text-white font-bold text-xs\`}>
                                {asset.symbol[0]}
                              </div>
                              <div>
                                <p className="font-bold text-brand-dark">{asset.name}</p>
                                <p className="text-xs text-gray-500">{asset.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-brand-dark">{asset.balance} {asset.symbol}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-medium text-brand-dark">\$\${(asset.value / asset.balance).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-bold text-brand-dark">\$\${asset.value.toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
//`;
   content = content.replace(mainGridRegex, newTabContent);
}

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
console.log('Portfolio.tsx rewritten');
