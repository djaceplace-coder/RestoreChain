import React, { useState } from 'react';
import { Plus, RefreshCw, AlertCircle, Link2, Search, ExternalLink } from 'lucide-react';
import AddAssetModal from '../../components/AddAssetModal';

export default function Wallets() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wallets = [
    { id: 1, name: 'Coinbase', type: 'Exchange', status: 'active', lastSync: '10 mins ago', balance: '$42,500.00' },
    { id: 2, name: 'MetaMask', type: 'Wallet', status: 'active', lastSync: '1 hr ago', balance: '$12,450.20' },
    { id: 3, name: 'Kraken', type: 'Exchange', status: 'error', lastSync: '2 days ago', balance: '$8,120.00', error: 'API Key Expired' },
  ];

  return (
    <div className="animate-fade-in">
      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Connected Wallets & Exchanges</h1>
          <p className="text-brand-text-gray">Manage your data sources. We only require read access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
        >
          <Plus size={20} /> Add Funds & Wallets
        </button>
      </header>

      {/* Sync Status Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-4 items-start mb-8">
        <div className="bg-orange-100 p-2 rounded-lg text-orange-600 shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-orange-800">Action Required: Sync Error</h3>
          <p className="text-sm text-orange-700 mt-1">1 connection requires your attention. An expired API key is preventing us from pulling your latest Kraken transactions, which may affect your tax calculations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {wallets.map(wallet => (
          <div key={wallet.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-purple/30 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                {wallet.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-brand-dark flex items-center gap-2">
                  {wallet.name}
                  {wallet.status === 'error' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                      Error
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{wallet.type} • Last synced {wallet.lastSync}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
              <div className="text-right">
                <p className="font-bold text-brand-dark">{wallet.balance}</p>
                {wallet.error ? (
                  <p className="text-xs font-bold text-red-500">{wallet.error}</p>
                ) : (
                  <p className="text-xs text-green-500 font-bold flex items-center justify-end gap-1">
                    <Link2 size={12} /> Connected
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-brand-purple hover:bg-purple-50 rounded-lg transition-colors" title="Sync now">
                  <RefreshCw size={18} />
                </button>
                <button className="p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors" title="View details">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
