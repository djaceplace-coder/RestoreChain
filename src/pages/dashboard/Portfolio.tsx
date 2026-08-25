import React, { useState } from 'react';
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';

export default function Portfolio() {
  const [showBalance, setShowBalance] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');

  const assets = [
    { name: 'Bitcoin', symbol: 'BTC', balance: 1.245, value: 84500.20, change: 4.2, color: 'bg-orange-500' },
    { name: 'Ethereum', symbol: 'ETH', balance: 14.5, value: 45200.50, change: -1.2, color: 'bg-blue-500' },
    { name: 'USDC', symbol: 'USDC', balance: 12450.00, value: 12450.00, change: 0, color: 'bg-blue-400' },
    { name: 'Solana', symbol: 'SOL', balance: 145.2, value: 14200.40, change: 12.5, color: 'bg-purple-500' },
  ];

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="animate-fade-in">
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
          <div className="text-4xl md:text-5xl font-display font-bold text-brand-dark">
            {showBalance ? `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center text-sm font-bold text-green-500">
              <ArrowUpRight size={16} /> $4,240.50 (2.4%)
            </span>
            <span className="text-sm text-gray-500">Past 24 hours</span>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          {['24H', '1W', '1M', '1Y', 'ALL'].map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${
                timeRange === range ? 'bg-white shadow-sm text-brand-dark' : 'text-gray-500 hover:text-brand-dark'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Cross promo card */}
      <div className="bg-gradient-to-r from-brand-purple to-blue-600 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold font-display mb-2">Secure your account with the mobile app</h3>
          <p className="text-purple-100 text-sm max-w-md">Enable push notifications for critical reconciliation updates and approve multi-sig transactions on the go.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm backdrop-blur-sm transition-colors border border-white/20">
            App Store
          </button>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm backdrop-blur-sm transition-colors border border-white/20">
            Google Play
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-brand-dark">Your Assets</h2>
        </div>
        <div className="overflow-x-auto">
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
                <tr key={asset.symbol} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${asset.color} flex items-center justify-center text-white font-bold text-xs`}>
                        {asset.symbol[0]}
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark">{asset.name}</p>
                        <p className="text-xs text-gray-500">{asset.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-brand-dark">{showBalance ? asset.balance.toLocaleString() : '••••'}</p>
                    <p className="text-xs text-gray-500">{asset.symbol}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-brand-dark">${(asset.value / asset.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <div className={`text-xs font-bold flex items-center justify-end gap-1 ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {Math.abs(asset.change)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-brand-dark">{showBalance ? `$${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••'}</p>
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
