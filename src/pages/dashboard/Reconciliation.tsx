import React from 'react';
import { AlertTriangle, CheckCircle, Search, ArrowRight, HelpCircle } from 'lucide-react';

export default function Reconciliation() {
  const unresolvedItems = [
    { id: 'RC-1049', type: 'Missing Cost Basis', asset: 'ETH', date: 'Oct 12, 2026', issue: 'Sent 2.5 ETH to external wallet. We need to know if this was a transfer to your own wallet or a payment.', status: 'open' },
    { id: 'RC-1052', type: 'Orphaned Transfer', asset: 'USDC', date: 'Oct 14, 2026', issue: 'Received 10,000 USDC but the source wallet is not connected.', status: 'open' },
    { id: 'RC-1088', type: 'Unclassified DeFi', asset: 'UNI-V2', date: 'Oct 18, 2026', issue: 'Liquidity provision detected. Please confirm the pair and amounts.', status: 'open' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Reconciliation Center</h1>
          <p className="text-brand-text-gray">Review and resolve transaction gaps to ensure accurate portfolio and tax tracking.</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-6">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ledger Health</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '92%' }}></div>
              </div>
              <span className="font-bold text-brand-dark">92%</span>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Needs Review</p>
            <p className="font-bold text-red-500 text-lg leading-none flex items-center gap-1">
              <AlertTriangle size={16} /> 3 Items
            </p>
          </div>
        </div>
      </header>

      {/* Main Worklist */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search items by ID or asset..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">
              Filter
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-purple text-white rounded-xl text-sm font-bold hover:bg-brand-purple/90 transition-colors">
              Auto-Resolve
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {unresolvedItems.map(item => (
            <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                      <AlertTriangle size={12} /> {item.type}
                    </span>
                    <span className="text-sm font-bold text-gray-500">{item.id}</span>
                    <span className="text-sm text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-brand-dark mb-1">{item.issue}</h3>
                </div>
                
                <div className="flex flex-wrap lg:flex-nowrap gap-3 items-start shrink-0 lg:w-[400px]">
                  {/* Mock one-click fixes based on item type */}
                  {item.type === 'Missing Cost Basis' && (
                     <>
                       <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">Transfer to self</button>
                       <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">Payment/Gift</button>
                     </>
                  )}
                  {item.type === 'Orphaned Transfer' && (
                     <>
                       <button className="flex-1 px-4 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">Connect Wallet</button>
                       <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-brand-dark hover:bg-gray-50 transition-colors">Mark as Income</button>
                     </>
                  )}
                  {item.type === 'Unclassified DeFi' && (
                     <>
                       <button className="flex-1 px-4 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-bold hover:bg-black transition-colors">Review Activity</button>
                     </>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {unresolvedItems.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">You're all caught up!</h3>
              <p className="text-brand-text-gray">Your ledger is 100% reconciled and ready for tax reporting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
