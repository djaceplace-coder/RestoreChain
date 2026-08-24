import React from 'react';
import { Newspaper, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const posts = [
    { title: "How We Recovered $4.2M from the Mango Markets Exploiter", cat: "Case Study", date: "Oct 12, 2025" },
    { title: "The Rise of Solana Drainers: Technical Breakdown", cat: "Threat Intel", date: "Oct 05, 2025" },
    { title: "Tornado Cash Deanonymization: A Machine Learning Approach", cat: "Research", date: "Sep 28, 2025" },
    { title: "Legal Precedent: Serving Subpoenas via NFT", cat: "Legal", date: "Sep 15, 2025" }
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="py-24 bg-brand-dark text-white text-center border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <Newspaper className="mx-auto text-brand-purple mb-6" size={48} />
          <h1 className="text-5xl font-display font-bold mb-6">Threat Intel Blog</h1>
          <p className="text-xl text-gray-400">Case studies, forensic research, and legal strategies from the front lines of crypto recovery.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-4 block">{post.cat}</span>
                  <h3 className="text-2xl font-bold font-display text-brand-dark mb-4">{post.title}</h3>
                </div>
                <div className="flex justify-between items-center mt-8 border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-500 flex items-center gap-2"><Clock size={14}/> {post.date}</span>
                  <button className="text-brand-dark font-bold hover:text-brand-purple transition-colors flex items-center gap-1">Read <ArrowRight size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-purple-bg text-center">
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Subscribe to Threat Alerts</h2>
        <p className="text-brand-text-gray mb-8">Get notified immediately when new major vulnerabilities or phishing campaigns are identified.</p>
        <Link to="/signup" className="inline-block bg-brand-dark text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-colors">
          Join Mailing List
        </Link>
      </section>
    </div>
  );
}
