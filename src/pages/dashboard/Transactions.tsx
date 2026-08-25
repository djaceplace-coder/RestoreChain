import React, { useState } from 'react';
import { Search, Filter, Download, ArrowDownRight, ArrowUpRight, ArrowRightLeft } from 'lucide-react';

export default function Transactions() {
  const [filter, setFilter] = useState('All');

  const transactions = [
    { id: 'tx1', date: 'Oct 24, 2026', type: 'Deposit', asset: 'BTC', amount: '+0.15', value: '$12,450.00', status: 'Completed', wallet: 'Coinbase' },
    { id: 'tx2', date: 'Oct 22, 2026', type: 'Trade', asset: 'ETH -> USDC', amount: '-2.0 ETH', value: '$6,420.00', status: 'Completed', wallet: 'MetaMask' },
    { id: 'tx3', date: 'Oct 19, 2026', type: 'Withdrawal', asset: 'SOL', amount: '-45.0', value: '$4,500.00', status: 'Completed', wallet: 'Kraken' },
    { id: 'tx4', date: 'Oct 15, 2026', type: 'Reward', asset: 'ADA', amount: '+150.5', value: '$52.50', status: 'Completed', wallet: 'Yoroi Wallet' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Transactions</h1>
          <p className="text-brand-text-gray">Your complete history across all connected wallets.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-brand-dark font-bold rounded-xl hover:bg-gray-50 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50">
          <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 hide-scrollbar">
            {['All', 'Deposits', 'Withdrawals', 'Trades', 'Rewards'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  filter === f ? 'bg-brand-dark text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search tx hash, asset..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-purple"
              />
            </div>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Asset/Amount</th>
                <th className="px-6 py-4 font-medium">Value (USD)</th>
                <th className="px-6 py-4 font-medium">Wallet</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'Deposit' || tx.type === 'Reward' ? 'bg-green-100 text-green-600' :
                        tx.type === 'Withdrawal' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {tx.type === 'Deposit' || tx.type === 'Reward' ? <ArrowDownRight size={16} /> :
                         tx.type === 'Withdrawal' ? <ArrowUpRight size={16} /> : <ArrowRightLeft size={16} />}
                      </div>
                      <span className="font-bold text-brand-dark">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : tx.amount.startsWith('-') ? 'text-red-600' : 'text-brand-dark'}`}>
                      {tx.amount}
                    </p>
                    <p className="text-xs text-gray-500">{tx.asset}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-brand-dark">{tx.value}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.wallet}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
