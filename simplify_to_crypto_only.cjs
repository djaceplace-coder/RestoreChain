const fs = require('fs');

// 1. UPDATE AdminUserDetail.tsx
let adminFile = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Replace the handleBalanceProvisioning function with a simpler handleBtcProvisioning
const handleBalanceRegex = /const handleBalanceProvisioning = async \([\s\S]*?finally \{\n      setIsSubmitting\(false\);\n    \}\n  \};/;
const newHandleBtc = `const handleBtcProvisioning = async (action: 'add' | 'deduct' | 'clear') => {
    setIsSubmitting(true);
    setUpdateStatus(\`Executing crypto \${action}...\`);

    try {
      const finalUsdEquivalent = parseFloat(usdAmount) || 0;
      const finalBtc = parseFloat(cryptoAmount) || 0;

      if (action !== 'clear' && finalBtc <= 0) {
        throw new Error('Please enter a valid crypto amount.');
      }

      const { error } = await supabase.rpc('admin_provision_btc', {
        p_user_id: id,
        p_action: action,
        p_btc_amount: finalBtc,
        p_usd_value: finalUsdEquivalent,
        p_tx_date: txDate,
        p_narration: deductionReason || 'System Update'
      });

      if (error) throw error;

      setUpdateStatus(\`Success! BTC \${action} executed successfully.\`);
      
      // Clear inputs
      setUsdAmount('');
      setCryptoAmount('');
      
      fetchUserAndData();
      
      setTimeout(() => {
        setUpdateStatus('');
      }, 4000);
      
    } catch (err: any) {
      setUpdateStatus(\`Error: \${err.message}\`);
    } finally {
      setIsSubmitting(false);
    }
  };`;
adminFile = adminFile.replace(handleBalanceRegex, newHandleBtc);

// Remove the fiat state variable
adminFile = adminFile.replace(/const \[fiatProvisionAmount, setFiatProvisionAmount\] = useState\(''\);\n/, '');

// Replace the UI cards in AdminUserDetail (keep only Crypto)
const uiRegex = /<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">[\s\S]*?{updateStatus && \(/;
const newUI = `<div className="max-w-2xl mx-auto">
              {/* Crypto Provisioning Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden mb-6">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl pointer-events-none"></div>
                
                <h3 className="text-lg font-bold text-brand-dark mb-4 relative z-10 flex items-center gap-2">
                  <Bitcoin size={20} className="text-orange-500" />
                  Crypto Provisioning (BTC)
                </h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                        USD Equivalent
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={usdAmount}
                        onChange={(e) => {
                          setUsdAmount(e.target.value);
                          if(e.target.value) {
                             setCryptoAmount((parseFloat(e.target.value) / btcPrice).toFixed(6));
                          } else {
                             setCryptoAmount('');
                          }
                        }}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                        BTC Amount
                      </label>
                      <input
                        type="number"
                        step="0.000001"
                        value={cryptoAmount}
                        onChange={(e) => {
                          setCryptoAmount(e.target.value);
                          if(e.target.value) {
                             setUsdAmount((parseFloat(e.target.value) * btcPrice).toFixed(2));
                          } else {
                             setUsdAmount('');
                          }
                        }}
                        placeholder="0.000000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:border-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleBtcProvisioning('add')}
                      className="py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <PlusCircle size={16} /> Add BTC
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleBtcProvisioning('deduct')}
                      className="py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <MinusCircle size={16} /> Deduct
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleBtcProvisioning('clear')}
                      className="col-span-2 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 text-sm border border-red-100"
                    >
                      <Trash2 size={16} /> Clear Crypto Balance
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {updateStatus && (`;

adminFile = adminFile.replace(uiRegex, newUI);
// Update the description subtitle too
adminFile = adminFile.replace(
  /<p className="text-sm text-gray-500 mt-1">Directly manage Crypto \(BTC\) and Personal Fiat balances independently\.<\/p>/,
  '<p className="text-sm text-gray-500 mt-1">Directly manage Crypto (BTC) balance and its USD equivalent in real-time.</p>'
);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', adminFile);

// 2. UPDATE Portfolio.tsx
let portFile = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// The two card grid wrapper is grid-cols-1 md:grid-cols-2, let's make it max-w-xl so it doesn't stretch too crazy when it's single
portFile = portFile.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/,
  '<div className="max-w-md">'
);

// Remove Personal Balance card
const pBalanceRegex = /{\/\* Personal Balance \*\/} *<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">[\s\S]*?<\/div> *<\/div> *<\/div>/;
portFile = portFile.replace(pBalanceRegex, '</div>');
fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', portFile);

// 3. UPDATE Overview.tsx
let overviewFile = fs.readFileSync('src/pages/dashboard/Overview.tsx', 'utf8');
overviewFile = overviewFile.replace(
  /const fiat = Number\(userProfile.fiat_balance \|\| 0\);\n        \n        \/\/ Calculate live crypto value\n        const cryptoUsdValue = portfolio.reduce\(\(sum, asset\) => {/,
  `// Calculate live crypto value\n        const cryptoUsdValue = portfolio.reduce((sum, asset) => {`
);
overviewFile = overviewFile.replace(
  /const liveTotal = fiat \+ cryptoUsdValue;/,
  `const liveTotal = cryptoUsdValue;`
);

fs.writeFileSync('src/pages/dashboard/Overview.tsx', overviewFile);

console.log("Successfully simplified React frontend to Crypto-only.");
