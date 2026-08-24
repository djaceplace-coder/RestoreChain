import { Shield, Search, LockKeyhole, RefreshCcw } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Stolen Asset Tracing',
      description: 'Advanced heuristic tracking of compromised funds across blockchains, mixers, and bridges to identify liquidation points.',
      icon: Search,
    },
    {
      title: 'Wallet Recovery',
      description: 'Brute-force and cryptographic recovery of lost passwords, corrupted seed phrases, and inaccessible hardware wallets.',
      icon: RefreshCcw,
    },
    {
      title: 'Smart Contract Audits',
      description: 'Pre-deployment security reviews for institutional clients to prevent exploits and reentrancy attacks.',
      icon: Shield,
    },
    {
      title: 'Post-Exploit Investigation',
      description: 'Rapid-response incident investigation to determine attack vectors and patch vulnerabilities immediately.',
      icon: LockKeyhole,
    }
  ];

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl font-display font-bold text-brand-dark mb-6">Our Services</h1>
        <p className="text-xl text-brand-text-gray leading-relaxed">
          Comprehensive blockchain security and recovery solutions tailored for both individuals and enterprise organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6 text-brand-purple">
              <service.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold font-display mb-4 text-brand-dark">{service.title}</h3>
            <p className="text-brand-text-gray leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
