import React, { useState, useMemo } from 'react';
import { Search, Wallet, Link2, Copy, CheckCircle, ChevronRight, Download } from 'lucide-react';
import Modal from './ui/Modal';
import { COINS } from '../data/coins';
import CoinLogo from './CoinLogo';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // View states: 'list' -> 'details'
  const [view, setView] = useState<'list' | 'details'>('list');

  const filteredCoins = useMemo(() => {
    if (!searchTerm) return COINS.slice(0, 60); // show top 20 by default
    const lower = searchTerm.toLowerCase();
    return COINS.filter(c => 
      c.symbol.toLowerCase().includes(lower) || 
      c.name.toLowerCase().includes(lower)
    ).slice(0, 60);
  }, [searchTerm]);

  const activeCoin = COINS.find(c => c.id === selectedCoin);

  // Mock addresses based on network
  const getMockAddress = (network: string) => {
    if (network === 'Bitcoin' || network === 'BTC') return 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
    if (network === 'Solana' || network === 'SOL') return '7v91N7iZ9mNicL8WfG6cgSCKyRXydQdWc6kRUDqQpK3V';
    return '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // EVM default
  };

  const handleSelectCoin = (id: string) => {
    setSelectedCoin(id);
    setView('details');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetState = () => {
    setView('list');
    setSelectedCoin(null);
    setSearchTerm('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={view === 'list' ? 'Select Crypto Wallet' : `Deposit ${activeCoin?.symbol}`} maxWidth="max-w-2xl">
      {view === 'list' ? (
        <div className="space-y-4">
          <p className="text-gray-500 mb-4">Select a cryptocurrency to add to your portfolios or connect a wallet.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="flex flex-col items-center justify-center p-6 bg-purple-50 border border-purple-100 rounded-2xl hover:border-brand-purple transition-colors group">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-brand-purple mb-3">
                <Wallet size={24} />
              </div>
              <span className="font-bold text-brand-dark group-hover:text-brand-purple">Connect Wallet</span>
              <span className="text-xs text-gray-500 mt-1">MetaMask, Phantom, etc.</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-2xl hover:border-blue-500 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-500 mb-3">
                <Link2 size={24} />
              </div>
              <span className="font-bold text-brand-dark group-hover:text-blue-600">Connect Exchange</span>
              <span className="text-xs text-gray-500 mt-1">Coinbase, Binance, etc.</span>
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search 100+ supported portfolio assets (e.g. BTC, Ethereum)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
              {filteredCoins.length > 0 ? filteredCoins.map(coin => (
                <button 
                  key={coin.id}
                  onClick={() => handleSelectCoin(coin.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={coin.symbol} size="sm" />
                    <div>
                      <p className="font-bold text-brand-dark">{coin.name}</p>
                      <p className="text-xs text-gray-500">{coin.symbol} • {coin.network}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
              )) : (
                <div className="p-8 text-center text-gray-500">No portfolio assets found matching "{searchTerm}"</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {activeCoin && (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <CoinLogo symbol={activeCoin.symbol} size="md" />
                  <div>
                    <h4 className="font-bold text-brand-dark">{activeCoin.name} ({activeCoin.symbol})</h4>
                    <p className="text-xs text-gray-500">Network: <span className="font-bold text-brand-dark">{activeCoin.network}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Current Price</p>
                  <p className="font-bold text-brand-dark">${activeCoin.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </div>

              <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="w-40 h-40 bg-gray-100 mx-auto mb-4 rounded-xl flex items-center justify-center border border-gray-200">
                  {/* Mock QR Code */}
                  <div className="grid grid-cols-4 grid-rows-4 gap-1 p-2 w-32 h-32 opacity-20">
                    {Array.from({length: 16}).map((_, i) => (
                      <div key={i} className={`bg-brand-dark rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                    ))}
                  </div>
                </div>
                <p className="text-sm font-bold text-brand-dark mb-1">Your {activeCoin.symbol} Deposit Address</p>
                <p className="text-xs text-orange-500 font-bold mb-4">Only send {activeCoin.symbol} on the {activeCoin.network} network.</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono text-brand-dark overflow-hidden text-ellipsis whitespace-nowrap">
                    {getMockAddress(activeCoin.network)}
                  </div>
                  <button 
                    onClick={() => handleCopy(getMockAddress(activeCoin.network))}
                    className="p-3 bg-brand-dark text-white rounded-xl hover:bg-black transition-colors"
                  >
                    {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setView('list')} className="flex-1 px-4 py-3 font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Back
                </button>
                <button onClick={handleClose} className="flex-1 px-4 py-3 font-bold text-white bg-brand-purple hover:bg-brand-purple/90 rounded-xl transition-colors">
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
