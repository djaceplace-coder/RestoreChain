import os
import re

path = 'src/pages/dashboard/Portfolio.tsx'
with open(path, 'r') as f:
    content = f.read()

replacement = """              <tbody className="divide-y divide-gray-100">
                {assets.map((asset) => {
                  const liveRateData = liveRates.find((r: any) => r.symbol.toUpperCase() === asset.symbol.toUpperCase());
                  const livePrice = liveRateData ? liveRateData.price : (asset.balance > 0 ? (asset.value / asset.balance) : 0);
                  const liveValue = livePrice * asset.balance;
                  
                  return (
                  <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <CoinLogo symbol={asset.symbol} size="md" />
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
                      <p className="font-medium text-brand-dark">${Number(livePrice).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-brand-dark">${Number(liveValue || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </td>
                  </tr>
                )})}
              </tbody>"""

content = re.sub(r'<tbody className="divide-y divide-gray-100">[\s\S]*?</tbody>', replacement, content)

with open(path, 'w') as f:
    f.write(content)
