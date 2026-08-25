const fs = require('fs');

const code = `
import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, ExternalLink, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function NFTs() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', collection: '', floor_price: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNFTs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data } = await supabase
      .from('nfts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (data) setNfts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNFTs();
    const channel = supabase.channel('user_nfts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'nfts' }, fetchNFTs)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('nfts').insert({
        user_id: user.id,
        name: form.name,
        collection: form.collection,
        floor_price: Number(form.floor_price) || 0,
        status: 'pending'
      });
    }
    
    setIsSubmitting(false);
    setShowAddForm(false);
    setForm({ name: '', collection: '', floor_price: '' });
  };

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">NFT Gallery</h1>
          <p className="text-brand-text-gray">View and track the value of your non-fungible tokens.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-brand-purple text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition-opacity"
        >
          <Plus size={18} /> Add NFT
        </button>
      </header>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="animate-spin text-brand-purple" size={32} />
        </div>
      ) : nfts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <ImageIcon className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="font-bold text-brand-dark mb-2">No NFTs Found</h3>
          <p className="text-sm text-gray-500 mb-6">You haven't added any NFTs to your portfolio yet.</p>
          <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-brand-purple text-white rounded-lg font-bold hover:bg-opacity-90">
            Add Your First NFT
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <div key={nft.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative">
              {nft.status === 'pending' && (
                <div className="absolute top-2 right-2 z-10 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                  Pending Admin
                </div>
              )}
              {/* Mock Image Area */}
              <div className="aspect-square w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                 <ImageIcon size={48} className="text-gray-300" />
                 {nft.status === 'active' && (
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button className="flex items-center gap-2 bg-white text-brand-dark px-4 py-2 rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                       View on OpenSea <ExternalLink size={14} />
                     </button>
                   </div>
                 )}
              </div>
              
              <div className="p-4">
                <p className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-1 truncate">{nft.collection}</p>
                <h3 className="font-bold text-brand-dark truncate mb-4">{nft.name}</h3>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Floor Price</p>
                    <p className="font-bold text-brand-dark">\${Number(nft.floor_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-brand-dark/20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-brand-dark text-lg">Add NFT</h2>
              <button onClick={() => setShowAddForm(false)} className="p-2 text-gray-400 hover:text-brand-dark rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-sm text-gray-500 mb-4">
                Register an NFT to your portfolio. It will be marked as "Pending" until an administrator verifies the asset.
              </p>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">NFT Name</label>
                <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="e.g., Bored Ape #8492" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Collection</label>
                <input required type="text" value={form.collection} onChange={e => setForm({...form, collection: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="e.g., BAYC" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Floor Price (USD Value)</label>
                <input required type="number" step="0.01" value={form.floor_price} onChange={e => setForm({...form, floor_price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-purple" placeholder="45000.00" />
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-opacity-90 transition-opacity disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/pages/dashboard/NFTs.tsx', code);
