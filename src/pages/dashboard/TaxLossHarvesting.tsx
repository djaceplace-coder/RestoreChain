import React from 'react';
import { TrendingDown, Info } from 'lucide-react';

export default function TaxLossHarvesting() {
  const opportunities = [
    { asset: 'Ethereum (ETH)', costBasis: '$4,500.00', currentPrice: '$2,800.00', potentialLoss: '-$1,700.00', holdings: '1.0 ETH' },
    { asset: 'Solana (SOL)', costBasis: '$200.00', currentPrice: '$145.00', potentialLoss: '-$55.00', holdings: '10.0 SOL' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Tax Loss Harvesting</h1>
        <p className="text-brand-text-gray">Identify unrealized losses to offset your capital gains.</p>
      </header>

      <div className="bg-brand-purple text-white p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold font-display mb-2">Total Harvesting Potential</h3>
          <p className="text-purple-100 text-sm">Selling these underwater assets today could lower your tax bill.</p>
        </div>
        <div className="text-4xl font-display font-bold text-white">
          -$1,755.00
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <Info size={16} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-600">Opportunities ranked by potential tax impact</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium text-right">Holdings</th>
                <th className="px-6 py-4 font-medium text-right">Cost Basis</th>
                <th className="px-6 py-4 font-medium text-right">Current Price</th>
                <th className="px-6 py-4 font-medium text-right">Potential Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {opportunities.map((opp, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-dark">{opp.asset}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{opp.holdings}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{opp.costBasis}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{opp.currentPrice}</td>
                  <td className="px-6 py-4 text-right font-bold text-red-500 flex items-center justify-end gap-1">
                    <TrendingDown size={16} /> {opp.potentialLoss}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
