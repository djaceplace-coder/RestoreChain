import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-display font-bold text-brand-dark mb-6">About Tracefield</h1>
        <p className="text-xl text-brand-text-gray mb-10 leading-relaxed">
          Tracefield was founded on the belief that digital asset ownership should be secure, recoverable, and transparent. We combine cutting-edge blockchain forensics with legal expertise to help individuals and institutions recover lost funds and secure their digital future.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 font-display">Our Mission</h3>
            <p className="text-brand-text-gray leading-relaxed">
              To provide accessible, high-tier asset recovery services to victims of cybercrime, lost wallets, and compromised keys across all major blockchain networks.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-2xl font-bold mb-4 font-display">Our Vision</h3>
            <p className="text-brand-text-gray leading-relaxed">
              A safer digital economy where participants can confidently interact with decentralized protocols without the looming fear of permanent, unrecoverable loss.
            </p>
          </div>
        </div>
        
        <h2 className="text-3xl font-display font-bold text-brand-dark mb-6">Why Trust Us?</h2>
        <ul className="space-y-4 mb-10">
          <li className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 mt-1">1</div>
            <div>
              <strong className="block text-brand-dark">Industry-Leading Success Rate</strong>
              <span className="text-brand-text-gray">We've recovered millions in digital assets across hundreds of cases.</span>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 mt-1">2</div>
            <div>
              <strong className="block text-brand-dark">Advanced Forensics Tooling</strong>
              <span className="text-brand-text-gray">Proprietary chain-analysis software that tracks assets through mixers and cross-chain bridges.</span>
            </div>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0 mt-1">3</div>
            <div>
              <strong className="block text-brand-dark">Legal & Law Enforcement Partnerships</strong>
              <span className="text-brand-text-gray">We work directly with exchanges and global authorities to freeze and seize stolen funds.</span>
            </div>
          </li>
        </ul>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mt-12">
          <h3 className="text-2xl font-bold mb-4 font-display">Our Headquarters</h3>
          <p className="text-brand-text-gray leading-relaxed mb-2">
            Tracefield Ltd. is headquartered in the financial center of Europe.
          </p>
          <p className="text-brand-text-gray font-medium mb-1"><strong>Location:</strong> London, United Kingdom</p>
          <p className="text-brand-text-gray font-medium"><strong>Email:</strong> <a href="mailto:info@tracefield.co.uk" className="text-brand-purple hover:underline">info@tracefield.co.uk</a></p>
        </div>
      </div>
    </div>
  );
}
