import React, { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Star, Plus, RefreshCw } from 'lucide-react';
import { useLivePrices } from '../../hooks/useLivePrices';
import AddAssetModal from '../../components/AddAssetModal';
import CoinLogo from '../../components/CoinLogo';

export default function Prices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { coins, loading, refresh } = useLivePrices(30000);

  const filteredCoins = coins.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">Cryptocurrency Prices</h1>
          <p className="text-brand-text-gray">Live market rates for {coins.length}+ supported assets.</p>
        </div>
        <button
          onClick={() => refresh()}
          className="self-start md:self-auto px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center gap-2 transition-colors shadow-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-brand-purple' : ''} />
          Sync Live Rates
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets (e.g. BTC, ETH, Solana)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium w-12"></th>
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium text-right">Price</th>
                <th className="px-6 py-4 font-medium text-right">24h Change</th>
                <th className="px-6 py-4 font-medium text-right hidden md:table-cell">Market Cap</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-gray-300 hover:text-yellow-400 cursor-pointer">
                    <Star size={18} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <CoinLogo symbol={coin.symbol} size="md" image={coin.image} />
                      <div>
                        <p className="font-bold text-brand-dark">{coin.name}</p>
                        <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold font-mono text-brand-dark">
                      ${coin.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: coin.price < 1 ? 6 : 2,
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`text-sm font-bold flex items-center justify-end gap-1 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.change24h >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(coin.change24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <p className="text-sm font-medium font-mono text-gray-600">${(coin.marketCap / 1e9).toFixed(2)}B</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 font-bold text-xs rounded-lg hover:bg-brand-purple hover:text-white transition-colors"
                    >
                      <Plus size={14} /> Track
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCoins.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No coins found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
