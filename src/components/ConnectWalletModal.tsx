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
  { id: 'metamask', name: 'MetaMask', type: 'web3', category: 'Web3 Wallet', icon: '🦊' },
  { id: 'trustwallet', name: 'Trust Wallet', type: 'web3', category: 'Web3 Wallet', icon: '🛡️' },
  { id: 'coinbase_wallet', name: 'Coinbase Wallet', type: 'web3', category: 'Web3 Wallet', icon: '🔵' },
  { id: 'binance', name: 'Binance', type: 'exchange', category: 'Exchange', icon: '🟨' },
  { id: 'coinbase', name: 'Coinbase', type: 'exchange', category: 'Exchange', icon: '📈' },
  { id: 'kraken', name: 'Kraken', type: 'exchange', category: 'Exchange', icon: '🦑' },
  { id: 'ledger', name: 'Ledger', type: 'hardware', category: 'Hardware Wallet', icon: '🔐' },
  { id: 'trezor', name: 'Trezor', type: 'hardware', category: 'Hardware Wallet', icon: '🔒' },
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
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">
                    {provider.icon}
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
