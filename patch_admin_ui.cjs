const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

// Replace the handleSystemUpdate with a call to the RPC
const handleSystemUpdateRegex = /const handleSystemUpdate = async \(e: React\.FormEvent\) => \{[\s\S]*?setUpdateStatus\(`Success![^`]*`\);\n\s*\} catch \(err: any\) \{/m;

const newHandleSystemUpdate = `const handleSystemUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateStatus(\`Executing balance \${txAction}...\`);
    try {
      const finalUsdAmount = parseFloat(usdAmount) || 0;
      const finalCryptoQty = parseFloat(cryptoAmount) || 0;
      const assetSymbol = provisionMode === 'crypto' ? selectedAsset.toUpperCase() : (user?.preferred_currency || 'USD');

      if (finalUsdAmount <= 0 && txAction !== 'clear') {
        throw new Error('Please enter a valid balance amount greater than 0.');
      }

      const { data: adminUser } = await supabase.auth.getUser();
      if (!adminUser.user) throw new Error("Admin not authenticated");

      // Call the streamlined SQL RPC function
      const { data, error } = await supabase.rpc('admin_update_balance', {
        p_admin_id: adminUser.user.id,
        p_user_id: id,
        p_action: txAction, // 'credit', 'debit', 'set', 'clear'
        p_usd_amount: finalUsdAmount,
        p_asset: assetSymbol,
        p_crypto_qty: finalCryptoQty,
        p_reason: deductionReason || \`Admin \${txAction} via dashboard\`
      });

      if (error) throw error;

      setUpdateStatus(\`Success! Balance \${txAction} executed successfully.\`);
    } catch (err: any) {`;

content = content.replace(handleSystemUpdateRegex, newHandleSystemUpdate);

// Add Freeze toggle logic
const freezeLogic = `
  const toggleFreeze = async () => {
    try {
      const newFreezeStatus = !user?.is_frozen;
      const { error } = await supabase.from('profiles').update({ is_frozen: newFreezeStatus }).eq('id', id);
      if (error) throw error;
      setUser({ ...user, is_frozen: newFreezeStatus });
      alert(newFreezeStatus ? 'Account has been frozen.' : 'Account has been unfrozen.');
    } catch (err: any) {
      alert(err.message);
    }
  };
`;

// Insert toggleFreeze before handleSystemUpdate
content = content.replace('const handleSystemUpdate', freezeLogic + '\n  const handleSystemUpdate');

// Add Set and Clear action buttons
const actionButtonsRegex = /<button\n\s*type="button"\n\s*onClick=\{\(\) => \{\n\s*setTxAction\('credit'\);[\s\S]*?<MinusCircle size=\{16\} \/>\n\s*Deduct \(Transfer Out\)\n\s*<\/button>\n\s*<\/div>/m;

const newActionButtons = `<button
                type="button"
                onClick={() => {
                  setTxAction('credit');
                  setCryptoAmount('');
                  setUsdAmount('');
                  setMessageTitle(\`\${selectedAsset} Balance Credited\`);
                }}
                className={\`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all \${
                  txAction === 'credit'
                    ? 'bg-orange-100 text-orange-700 shadow-sm ring-2 ring-orange-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }\`}
              >
                <PlusCircle size={16} />
                Credit (Add)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxAction('debit');
                  setCryptoAmount('');
                  setUsdAmount('');
                  setMessageTitle(\`\${selectedAsset} Balance Deduction\`);
                }}
                className={\`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all \${
                  txAction === 'debit'
                    ? 'bg-red-100 text-red-700 shadow-sm ring-2 ring-red-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }\`}
              >
                <MinusCircle size={16} />
                Debit (Deduct)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxAction('set');
                  setCryptoAmount('');
                  setUsdAmount('');
                  setMessageTitle(\`\${selectedAsset} Balance Override\`);
                }}
                className={\`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all \${
                  txAction === 'set'
                    ? 'bg-blue-100 text-blue-700 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }\`}
              >
                <RefreshCw size={16} />
                Set (Override)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTxAction('clear');
                  setCryptoAmount('0');
                  setUsdAmount('0');
                  setMessageTitle(\`Balance Cleared\`);
                }}
                className={\`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all \${
                  txAction === 'clear'
                    ? 'bg-gray-800 text-white shadow-sm ring-2 ring-gray-500/20'
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                }\`}
              >
                <MinusCircle size={16} />
                Clear All
              </button>
            </div>`;

content = content.replace(actionButtonsRegex, newActionButtons);

// Add the Freeze Button to the Header Profile Summary (near Impersonate)
const headerRegex = /<button \n\s*onClick=\{\(\) => \{\n\s*sessionStorage.setItem\('impersonated_user_id', user.id\);/m;

const newHeader = `<button 
            onClick={toggleFreeze}
            className={\`px-4 py-2 \${user?.is_frozen ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white font-bold rounded-xl text-sm transition-colors shadow-sm inline-flex items-center gap-2\`}
          >
            <ShieldAlert size={16} /> {user?.is_frozen ? 'Unfreeze Account' : 'Freeze Account'}
          </button>
          <button 
            onClick={() => {
              sessionStorage.setItem('impersonated_user_id', user.id);`;

content = content.replace(headerRegex, newHeader);

// Let's also hide the amount inputs if txAction is 'clear'
content = content.replace(
/\{!\(txAction === 'credit'\) && \(/,
`{!(txAction === 'credit' || txAction === 'clear') && (`
);

content = content.replace(
/Execute Balance \{txAction === 'credit' \? 'Credit' : 'Deduction'\}/,
`Execute {txAction === 'credit' ? 'Credit' : txAction === 'debit' ? 'Deduction' : txAction === 'set' ? 'Override' : 'Wipe'}`
);

// We need to also add an early return or hide inputs if 'clear'
const dualInputsRegex = /<div className=\{\`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border \$\{txAction === 'credit' \? 'bg-orange-50\/50 border-orange-100' : 'bg-red-50\/50 border-red-100'\}\`\}>/m;

const newDualInputs = `{txAction !== 'clear' && (
                  <div className={\`grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl border \${txAction === 'credit' ? 'bg-orange-50/50 border-orange-100' : txAction === 'set' ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50/50 border-red-100'}\`}>`;

content = content.replace(dualInputsRegex, newDualInputs);

content = content.replace(
/value=\{usdAmount\}[\s\S]*?onChange=\{\(e\) => handleUsdChange\(e.target.value\)\}[\s\S]*?\/>\n\s*<\/div>\n\s*<\/div>/m,
`value={usdAmount}
                        onChange={(e) => handleUsdChange(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple font-mono font-bold"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                )}`
); // close the condition for txAction !== 'clear'

fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log('patched AdminUserDetail.tsx successfully');
