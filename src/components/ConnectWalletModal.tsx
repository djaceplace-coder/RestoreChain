import React, { useState } from 'react';
import { X, Search, Wallet, Link2, Key, Shield, ChevronRight, Activity, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import Modal from './ui/Modal';
import { supabase } from '../lib/supabase';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WALLET_PROVIDERS = [
  { id: 'binance', name: 'Binance', type: 'exchange', category: 'Exchange', bgColor: 'bg-pink-600', text: 'B', textColor: 'text-white' },
  { id: 'coinbase', name: 'Coinbase', type: 'exchange', category: 'Exchange', bgColor: 'bg-blue-600', text: 'C', textColor: 'text-white' },
  { id: 'kraken', name: 'Kraken', type: 'exchange', category: 'Exchange', bgColor: 'bg-gray-800', text: 'K', textColor: 'text-white' },
  { id: 'kucoin', name: 'KuCoin', type: 'exchange', category: 'Exchange', bgColor: 'bg-teal-600', text: 'K', textColor: 'text-white' },
  { id: 'bybit', name: 'Bybit', type: 'exchange', category: 'Exchange', bgColor: 'bg-blue-600', text: 'B', textColor: 'text-white' },
  { id: 'okx', name: 'OKX', type: 'exchange', category: 'Exchange', bgColor: 'bg-indigo-600', text: 'O', textColor: 'text-white' },
  { id: 'bitfinex', name: 'Bitfinex', type: 'exchange', category: 'Exchange', bgColor: 'bg-red-600', text: 'B', textColor: 'text-white' },
  { id: 'huobi', name: 'Huobi', type: 'exchange', category: 'Exchange', bgColor: 'bg-pink-600', text: 'H', textColor: 'text-white' },
  { id: 'gateio', name: 'Gate.io', type: 'exchange', category: 'Exchange', bgColor: 'bg-blue-600', text: 'G', textColor: 'text-white' },
  { id: 'mexc', name: 'MEXC', type: 'exchange', category: 'Exchange', bgColor: 'bg-yellow-500', text: 'M', textColor: 'text-white' },
  { id: 'bitget', name: 'Bitget', type: 'exchange', category: 'Exchange', bgColor: 'bg-yellow-500', text: 'B', textColor: 'text-white' },
  { id: 'cryptocom', name: 'Crypto.com', type: 'exchange', category: 'Exchange', bgColor: 'bg-yellow-500', text: 'C', textColor: 'text-white' },
  { id: 'bitstamp', name: 'Bitstamp', type: 'exchange', category: 'Exchange', bgColor: 'bg-indigo-600', text: 'B', textColor: 'text-white' },
  { id: 'bithumb', name: 'Bithumb', type: 'exchange', category: 'Exchange', bgColor: 'bg-pink-600', text: 'B', textColor: 'text-white' },
  { id: 'upbit', name: 'Upbit', type: 'exchange', category: 'Exchange', bgColor: 'bg-yellow-500', text: 'U', textColor: 'text-white' },
  { id: 'gemini', name: 'Gemini', type: 'exchange', category: 'Exchange', bgColor: 'bg-indigo-600', text: 'G', textColor: 'text-white' },
  { id: 'htx', name: 'HTX', type: 'exchange', category: 'Exchange', bgColor: 'bg-pink-600', text: 'H', textColor: 'text-white' },
  { id: 'pionex', name: 'Pionex', type: 'exchange', category: 'Exchange', bgColor: 'bg-teal-600', text: 'P', textColor: 'text-white' },
  { id: 'bingx', name: 'BingX', type: 'exchange', category: 'Exchange', bgColor: 'bg-teal-600', text: 'B', textColor: 'text-white' },
  { id: 'lbank', name: 'LBank', type: 'exchange', category: 'Exchange', bgColor: 'bg-teal-600', text: 'L', textColor: 'text-white' },
  { id: 'whitebit', name: 'WhiteBIT', type: 'exchange', category: 'Exchange', bgColor: 'bg-red-600', text: 'W', textColor: 'text-white' },
  { id: 'xtcom', name: 'XT.COM', type: 'exchange', category: 'Exchange', bgColor: 'bg-red-600', text: 'X', textColor: 'text-white' },
  { id: 'coinex', name: 'CoinEx', type: 'exchange', category: 'Exchange', bgColor: 'bg-pink-600', text: 'C', textColor: 'text-white' },
  { id: 'bitrue', name: 'Bitrue', type: 'exchange', category: 'Exchange', bgColor: 'bg-green-600', text: 'B', textColor: 'text-white' },
  { id: 'probit', name: 'ProBit', type: 'exchange', category: 'Exchange', bgColor: 'bg-red-600', text: 'P', textColor: 'text-white' },
  { id: 'poloniex', name: 'Poloniex', type: 'exchange', category: 'Exchange', bgColor: 'bg-red-600', text: 'P', textColor: 'text-white' },
  { id: 'phemex', name: 'Phemex', type: 'exchange', category: 'Exchange', bgColor: 'bg-green-600', text: 'P', textColor: 'text-white' },
  { id: 'ascendex', name: 'AscendEX', type: 'exchange', category: 'Exchange', bgColor: 'bg-red-600', text: 'A', textColor: 'text-white' },
  { id: 'bitmart', name: 'BitMart', type: 'exchange', category: 'Exchange', bgColor: 'bg-purple-600', text: 'B', textColor: 'text-white' },
  { id: 'digifinex', name: 'DigiFinex', type: 'exchange', category: 'Exchange', bgColor: 'bg-purple-600', text: 'D', textColor: 'text-white' },
  { id: 'metamask', name: 'MetaMask', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-indigo-600', text: 'M', textColor: 'text-white' },
  { id: 'trustwallet', name: 'Trust Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-red-600', text: 'T', textColor: 'text-white' },
  { id: 'phantom', name: 'Phantom', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-teal-600', text: 'P', textColor: 'text-white' },
  { id: 'coinbasewallet', name: 'Coinbase Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-yellow-500', text: 'C', textColor: 'text-white' },
  { id: 'exodus', name: 'Exodus', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-red-600', text: 'E', textColor: 'text-white' },
  { id: 'rainbow', name: 'Rainbow', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-yellow-500', text: 'R', textColor: 'text-white' },
  { id: 'zerion', name: 'Zerion', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-blue-600', text: 'Z', textColor: 'text-white' },
  { id: 'argent', name: 'Argent', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-gray-800', text: 'A', textColor: 'text-white' },
  { id: 'safepal', name: 'SafePal', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-red-600', text: 'S', textColor: 'text-white' },
  { id: 'inchwallet', name: '1inch Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-teal-600', text: '1', textColor: 'text-white' },
  { id: 'mathwallet', name: 'Math Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-red-600', text: 'M', textColor: 'text-white' },
  { id: 'tokenpocket', name: 'TokenPocket', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-blue-600', text: 'T', textColor: 'text-white' },
  { id: 'bitkeep', name: 'BitKeep', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-pink-600', text: 'B', textColor: 'text-white' },
  { id: 'bravewallet', name: 'Brave Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-pink-600', text: 'B', textColor: 'text-white' },
  { id: 'core', name: 'Core', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-pink-600', text: 'C', textColor: 'text-white' },
  { id: 'kukai', name: 'Kukai', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-blue-600', text: 'K', textColor: 'text-white' },
  { id: 'keplr', name: 'Keplr', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-gray-800', text: 'K', textColor: 'text-white' },
  { id: 'leap', name: 'Leap', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-gray-800', text: 'L', textColor: 'text-white' },
  { id: 'martian', name: 'Martian', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-purple-600', text: 'M', textColor: 'text-white' },
  { id: 'petra', name: 'Petra', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-gray-800', text: 'P', textColor: 'text-white' },
  { id: 'suiwallet', name: 'Sui Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-yellow-500', text: 'S', textColor: 'text-white' },
  { id: 'tonkeeper', name: 'Tonkeeper', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-blue-600', text: 'T', textColor: 'text-white' },
  { id: 'myetherwallet', name: 'MyEtherWallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-pink-600', text: 'M', textColor: 'text-white' },
  { id: 'guarda', name: 'Guarda', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-pink-600', text: 'G', textColor: 'text-white' },
  { id: 'atomicwallet', name: 'Atomic Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-purple-600', text: 'A', textColor: 'text-white' },
  { id: 'zengo', name: 'Zengo', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-yellow-500', text: 'Z', textColor: 'text-white' },
  { id: 'enjinwallet', name: 'Enjin Wallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-blue-600', text: 'E', textColor: 'text-white' },
  { id: 'alphawallet', name: 'AlphaWallet', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-gray-800', text: 'A', textColor: 'text-white' },
  { id: 'imtoken', name: 'imToken', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-blue-600', text: 'i', textColor: 'text-white' },
  { id: 'spot', name: 'Spot', type: 'web3', category: 'Web3 Wallet', bgColor: 'bg-green-600', text: 'S', textColor: 'text-white' },
  { id: 'ledger', name: 'Ledger', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-yellow-500', text: 'L', textColor: 'text-white' },
  { id: 'trezor', name: 'Trezor', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-purple-600', text: 'T', textColor: 'text-white' },
  { id: 'keepkey', name: 'KeepKey', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-gray-800', text: 'K', textColor: 'text-white' },
  { id: 'ellipal', name: 'Ellipal', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-yellow-500', text: 'E', textColor: 'text-white' },
  { id: 'secux', name: 'SecuX', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-green-600', text: 'S', textColor: 'text-white' },
  { id: 'dcent', name: "D'CENT", type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-teal-600', text: 'D', textColor: 'text-white' },
  { id: 'bitbox', name: 'BitBox', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-pink-600', text: 'B', textColor: 'text-white' },
  { id: 'keystone', name: 'Keystone', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-green-600', text: 'K', textColor: 'text-white' },
  { id: 'coldcard', name: 'Coldcard', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-purple-600', text: 'C', textColor: 'text-white' },
  { id: 'tangem', name: 'Tangem', type: 'hardware', category: 'Hardware Wallet', bgColor: 'bg-purple-600', text: 'T', textColor: 'text-white' }
];

export default function ConnectWalletModal({ isOpen, onClose, onSuccess }: ConnectWalletModalProps) {
  const [step, setStep] = useState<'select' | 'configure' | 'success'>('select');
  const [search, setSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProviders = WALLET_PROVIDERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (provider: any) => {
    setSelectedProvider(provider);
    setStep('configure');
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      await supabase.from('wallet_connections').insert({
        user_id: session.user.id,
        wallet_provider: selectedProvider.id,
        wallet_type: selectedProvider.type,
        wallet_address: walletAddress || null,
        api_key_encrypted: apiKey || null,
        api_secret_encrypted: apiSecret || null,
        is_read_only: true,
        status: 'active'
      });

      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep('select');
        setApiKey('');
        setApiSecret('');
        setWalletAddress('');
        setSelectedProvider(null);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Failed to connect wallet');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 'select' ? "Connect Wallet or Exchange" : selectedProvider?.name}>
      {step === 'select' && (
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">Securely connect your wallets or exchanges to sync your portfolio balances and transaction history. Tracefield only requests read-only access.</p>
          <div className="bg-brand-purple/5 border border-brand-purple/10 rounded-xl p-3 flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#F6851B] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">M</div>
                <div className="w-8 h-8 rounded-full bg-[#3375BB] border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">T</div>
                <div className="w-8 h-8 rounded-full bg-[#F3BA2F] border-2 border-white flex items-center justify-center text-black text-xs font-bold shadow-sm">B</div>
             </div>
             <p className="text-xs font-medium text-brand-dark">Over <span className="font-bold text-brand-purple">300+</span> Web3 wallets & exchanges supported natively.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search wallets or exchanges..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4 pr-2">
            {filteredProviders.map(provider => (
              <button 
                key={provider.id}
                onClick={() => handleSelect(provider)}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-brand-purple hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md ${provider.bgColor} ${provider.textColor || 'text-white'}`}>
                    {provider.text}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-brand-dark group-hover:text-brand-purple transition-colors">{provider.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{provider.category}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-brand-purple transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'configure' && selectedProvider && (
        <form onSubmit={handleConnect} className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
            <Shield className="text-blue-600 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Bank-Grade Security</h4>
              <p className="text-xs text-blue-800 leading-relaxed">Your keys are encrypted end-to-end. Tracefield uses strict <strong>Read-Only</strong> permissions. We cannot move or trade your funds under any circumstances.</p>
            </div>
          </div>

          {selectedProvider.type === 'web3' || selectedProvider.type === 'hardware' ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Public Wallet Address</label>
              <input 
                type="text" 
                required
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                placeholder="0x..." 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">Paste your public wallet address to track balances.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Read-Only API Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder="Enter API Key" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">API Secret</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    required
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                    placeholder="Enter API Secret" 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all font-mono text-sm"
                  />
                </div>
              </div>
              <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4 mt-2">
                <li>Create an API key in your {selectedProvider.name} settings.</li>
                <li>Ensure "Read Info" is checked.</li>
                <li className="text-red-500 font-medium">Do NOT enable "Withdraw" or "Trading" permissions.</li>
              </ul>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={() => setStep('select')}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-brand-purple/90 transition-colors shadow-lg shadow-brand-purple/20 disabled:opacity-70"
            >
              {isSubmitting ? <Activity className="animate-spin" size={18} /> : <Link2 size={18} />}
              {isSubmitting ? 'Securing Connection...' : 'Securely Connect'}
            </button>
          </div>
        </form>
      )}

      {step === 'success' && (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-display font-bold text-brand-dark mb-2">Connection Secured</h3>
          <p className="text-gray-500">Your {selectedProvider?.name} portfolio is now syncing. Read-only permissions verified.</p>
        </div>
      )}
    </Modal>
  );
}
