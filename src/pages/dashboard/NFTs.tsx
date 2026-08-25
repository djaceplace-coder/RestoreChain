import React from 'react';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function NFTs() {
  const nfts = [
    { id: '1', name: 'Bored Ape Yacht Club #8492', collection: 'BAYC', floor: '14.5 ETH', lastSale: '16.2 ETH', image: 'bg-yellow-200' },
    { id: '2', name: 'Azuki #1024', collection: 'Azuki', floor: '4.2 ETH', lastSale: '4.5 ETH', image: 'bg-red-200' },
    { id: '3', name: 'Doodles #5555', collection: 'Doodles', floor: '1.8 ETH', lastSale: '2.0 ETH', image: 'bg-blue-200' },
    { id: '4', name: 'Pudgy Penguins #333', collection: 'Pudgy Penguins', floor: '10.5 ETH', lastSale: '11.0 ETH', image: 'bg-indigo-200' },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-brand-dark mb-2">NFT Gallery</h1>
        <p className="text-brand-text-gray">View and track the value of your non-fungible tokens.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <div key={nft.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
            {/* Mock Image Area */}
            <div className={`aspect-square w-full ${nft.image} flex items-center justify-center relative overflow-hidden`}>
               <ImageIcon size={48} className="text-white/50" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button className="flex items-center gap-2 bg-white text-brand-dark px-4 py-2 rounded-xl font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                   View on OpenSea <ExternalLink size={14} />
                 </button>
               </div>
            </div>
            
            <div className="p-4">
              <p className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-1">{nft.collection}</p>
              <h3 className="font-bold text-brand-dark truncate mb-4">{nft.name}</h3>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Floor Price</p>
                  <p className="font-bold text-brand-dark">{nft.floor}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Last Sale</p>
                  <p className="font-bold text-brand-dark">{nft.lastSale}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
