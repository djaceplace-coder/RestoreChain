const fs = require('fs');
let content = fs.readFileSync('src/pages/dashboard/Portfolio.tsx', 'utf8');

// The render logic is roughly:
/*
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
              const liveRateData = liveRates.find((r: any) => r.symbol?.toUpperCase() === (asset.symbol?.toUpperCase() || ""));
              const livePrice = liveRateData ? liveRateData.price : ((Number(asset.balance) || 0) > 0 ? (asset.value / (Number(asset.balance) || 0)) : 0);
              return sum + (livePrice * (Number(asset.balance) || 0));
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
*/

content = content.replace(
/const btcEquivalent = cryptoUsdValue \/ btcPrice;[\s\S]*?return \([\s\S]*?<div className="relative z-10">[\s\S]*?<div className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-1">[\s\S]*?<\/div>[\s\S]*?<div className="text-sm font-bold text-gray-500 mb-3">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\);/,
`const fiat = Number(userProfile?.fiat_balance || 0);
            const liveCryptoUsd = displayedBalance - fiat;
            const liveBtcEquivalent = liveCryptoUsd > 0 ? liveCryptoUsd / btcPrice : 0;
            
            return (
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-1">
                  {showBalance ? \`\${liveBtcEquivalent.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })} BTC\` : '•••••••• BTC'}
                </div>
                <div className="text-sm font-bold text-gray-500 mb-3">
                  {showBalance ? \`≈ $\${liveCryptoUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\` : '≈ $••••••••'}
                </div>
              </div>
            );`
);

fs.writeFileSync('src/pages/dashboard/Portfolio.tsx', content);
console.log('patched Portfolio.tsx');
