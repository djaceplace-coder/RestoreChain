import React, { useState } from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Glossary() {
  const [search, setSearch] = useState('');
  
  const terms = [
    { term: "Address Poisoning", def: "A scam where an attacker sends a tiny amount of crypto from a vanity address closely resembling one you regularly use, hoping you accidentally copy their address from your transaction history." },
    { term: "Chain Hopping", def: "A laundering technique where funds are rapidly moved across different blockchains using decentralized bridges to obfuscate the trail." },
    { term: "Heuristics", def: "Algorithmic rules used by chain analysis software to cluster wallet addresses and probabilistically identify ownership." },
    { term: "Mixer (Tumbler)", def: "A service (like Tornado Cash) that pools funds from multiple users and redistributes them to break the deterministic link between source and destination addresses." },
    { term: "OFAC Sanctions", def: "Lists published by the US Treasury designating individuals and wallet addresses barred from interacting with US entities." },
    { term: "Subpoena", def: "A legal writ ordering a person or company (like an exchange) to produce documents, such as the KYC data of a hacker's account." },
    { term: "UTXO", def: "Unspent Transaction Output. The fundamental accounting model used by Bitcoin, unlike the account-based model used by Ethereum." }
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="py-20 bg-brand-dark text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <BookOpen className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl font-display font-bold mb-6">Crypto Forensics Glossary</h1>
          <div className="relative max-w-xl mx-auto mt-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search terms (e.g., Mixer, Heuristics)..." 
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:border-brand-purple"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase())).map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand-purple/30 transition-colors">
                <h3 className="text-xl font-bold text-brand-dark mb-3">{t.term}</h3>
                <p className="text-brand-text-gray leading-relaxed">{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Need help investigating a complex term?</h2>
        <Link to="/signup" className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-full font-bold hover:bg-brand-purple/90 transition-colors">
          Contact an Analyst <ChevronRight size={20} />
        </Link>
      </section>
    </div>
  );
}
