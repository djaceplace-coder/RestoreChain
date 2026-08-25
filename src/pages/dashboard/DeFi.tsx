import React from 'react';
import { Layers, Droplet, ArrowUpRight, ArrowDownRight, Search, Activity } from 'lucide-react';

export default function DeFi() {
  const positions = [
    { protocol: 'Uniswap V3', type: 'Liquidity Pool', asset: 'ETH / USDC', balance: '$12,450.00', apy: '12.4%', status: 'Active', logo: 'bg-pink-100 text-pink-600' },
    { protocol: 'Aave V3', type: 'Lending', asset: 'USDC', balance: '$8,200.00', apy: '4.2%', status: 'Active', logo: 'bg-purple-100 text-purple-600' },
    { protocol: 'Lido', type: 'Liquid Staking', asset: 'stETH', balance: '$45,120.00', apy: '3.8%', status: 'Active', logo: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">DeFi Positions</h1>
          <p className="text-brand-text-gray">Track your yield farming, staking, and liquidity pools.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-purple/10 text-brand-purple rounded-lg"><Layers size={20} /></div>
            <h3 className="font-bold text-brand-dark">Total Locked Value</h3>
          </div>
          <p className="text-3xl font-display font-bold text-brand-dark">$65,770.00</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Activity size={20} /></div>
            <h3 className="font-bold text-brand-dark">Average APY</h3>
          </div>
          <p className="text-3xl font-display font-bold text-brand-dark">6.8%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Droplet size={20} /></div>
            <h3 className="font-bold text-brand-dark">Pending Yield</h3>
          </div>
          <p className="text-3xl font-display font-bold text-brand-dark">$412.50</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search protocols or assets..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Protocol</th>
                <th className="px-6 py-4 font-medium">Asset/Pool</th>
                <th className="px-6 py-4 font-medium text-right">Value</th>
                <th className="px-6 py-4 font-medium text-right">APY</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {positions.map((pos, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${pos.logo}`}>
                        {pos.protocol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark">{pos.protocol}</p>
                        <p className="text-xs text-gray-500">{pos.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-dark">{pos.asset}</td>
                  <td className="px-6 py-4 text-right font-bold text-brand-dark">{pos.balance}</td>
                  <td className="px-6 py-4 text-right text-green-600 font-bold">{pos.apy}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">
                      {pos.status}
                    </span>
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
