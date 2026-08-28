import os
import re

path = 'src/pages/dashboard/Portfolio.tsx'
with open(path, 'r') as f:
    content = f.read()

# Add getCurrencySymbol helper somewhere
helper = """  const getCurrencySymbol = (cur: string) => {
    switch(cur) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'NGN': return '₦';
      default: return '$';
    }
  };"""
content = re.sub(r'const greetingName', helper + '\n  const greetingName', content)

# Create the new balance block
new_balance_block = """      {/* Dual Balances Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crypto Balance (BTC Equivalent) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-100 rounded-full blur-2xl group-hover:bg-orange-200 transition-colors pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              Crypto Balance
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">Live</span>
            </h2>
            <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-brand-purple">
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          
          {(() => {
            const btcPrice = liveRates.find(r => r.symbol === 'BTC')?.price || 64000;
            const cryptoUsdValue = assets.reduce((sum, asset) => {
              const liveRateData = liveRates.find((r: any) => r.symbol.toUpperCase() === asset.symbol.toUpperCase());
              const livePrice = liveRateData ? liveRateData.price : (asset.balance > 0 ? (asset.value / asset.balance) : 0);
              return sum + (livePrice * asset.balance);
            }, 0);
            const btcEquivalent = cryptoUsdValue / btcPrice;
            
            return (
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-1">
                  {showBalance ? `${btcEquivalent.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })} BTC` : '•••••••• BTC'}
                </div>
                <div className="text-sm font-bold text-gray-500 mb-3">
                  {showBalance ? `≈ $${cryptoUsdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '≈ $••••••••'}
                </div>
              </div>
            );
          })()}

          <div className="flex gap-2 relative z-10">
            <button onClick={handleActionWithKYC} className="flex-1 px-4 py-2 bg-brand-dark text-white text-sm font-bold rounded-xl hover:bg-black transition-colors">Deposit</button>
            <button onClick={() => setIsWithdrawModalOpen(true)} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">Withdraw</button>
          </div>
        </div>

        {/* Fiat Balance */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-100 rounded-full blur-2xl group-hover:bg-green-200 transition-colors pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Fiat Balance</h2>
            <Link to="/dashboard/swap" className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-purple text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
              <Repeat size={14} /> Swap
            </Link>
          </div>
          
          <div className="relative z-10">
            <div className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-1">
              {showBalance ? `${getCurrencySymbol(userProfile?.preferred_currency)}${Number(userProfile?.fiat_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `•••••••• ${userProfile?.preferred_currency || 'USD'}`}
            </div>
            <div className="text-sm font-bold text-gray-500 mb-4 uppercase">
              {userProfile?.preferred_currency || 'USD'} Wallet
            </div>
          </div>
          
          <div className="flex gap-2 relative z-10">
            <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-400 text-sm font-bold rounded-xl cursor-not-allowed">Bank Transfer</button>
          </div>
        </div>
      </div>"""

# Replace old balance header
content = re.sub(r'\{/\* Total Balance Header \*/\}[\s\S]*?\{/\* Quick Actions \*/\}', new_balance_block + '\n\n      {/* Quick Actions */}', content)

# Change handleActionWithKYC behavior for deposit to setIsFundModalOpen
# actually let's ensure handleActionWithKYC is called properly
new_balance_block = new_balance_block.replace("onClick={handleActionWithKYC}", "onClick={() => handleActionWithKYC(() => setIsFundModalOpen(true))}")

content = re.sub(r'\{/\* Total Balance Header \*/\}[\s\S]*?\{/\* Quick Actions \*/\}', new_balance_block + '\n\n      {/* Quick Actions */}', content)

with open(path, 'w') as f:
    f.write(content)
