const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Add profitRate state
content = content.replace(
  `const [updateStatus, setUpdateStatus] = useState('');`,
  `const [updateStatus, setUpdateStatus] = useState('');\n  const [profitRate, setProfitRate] = useState('');\n  const [updatingProfit, setUpdatingProfit] = useState(false);`
);

// In fetchData, set profitRate
const fetchDataRegex = /setUser\(profileData\);/;
const newFetchData = `setUser(profileData);\n      setProfitRate(profileData.profit_rate?.toString() || '0');`;
content = content.replace(fetchDataRegex, newFetchData);

// Add updateProfitRate function
const addFuncRegex = /const handleSystemUpdate = async \(e: React.FormEvent\) => \{/;
const newFunc = `const handleUpdateProfitRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfit(true);
    await supabase.from('profiles').update({ profit_rate: parseFloat(profitRate) || 0 }).eq('id', id);
    setUpdatingProfit(false);
    setUser({...user, profit_rate: parseFloat(profitRate) || 0});
  };

  const handleSystemUpdate = async (e: React.FormEvent) => {`;
content = content.replace(addFuncRegex, newFunc);

// Add the UI for profit rate inside System Update tab. Let's find "System Initialization".
const systemInitRegex = /<h3 className="text-xl font-bold font-display text-brand-dark mb-4">System Update Tool<\/h3>/;
const newSystemInit = `<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold font-display text-brand-dark mb-4">Account Profit Rate (%)</h3>
            <p className="text-sm text-gray-500 mb-6">Set the simulated real-time percentage growth of the user's total balance. e.g. 5.5 for 5.5%.</p>
            <form onSubmit={handleUpdateProfitRate} className="flex gap-4">
               <input 
                 type="number" 
                 step="0.01"
                 value={profitRate}
                 onChange={(e) => setProfitRate(e.target.value)}
                 className="w-48 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500"
               />
               <button 
                 type="submit" 
                 disabled={updatingProfit}
                 className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50"
               >
                 {updatingProfit ? 'Updating...' : 'Set Profit Rate'}
               </button>
            </form>
          </div>
          
          <h3 className="text-xl font-bold font-display text-brand-dark mb-4">System Update Tool</h3>`;
content = content.replace(systemInitRegex, newSystemInit);

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log('AdminUserDetail updated');
