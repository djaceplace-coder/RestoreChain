import { Calculator, Zap, FileText, Clock } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      title: 'Trace stolen assets',
      description: 'We track your portfolio across all wallets, mixers, and bridges to calculate the exact path of your funds.',
      icon: <Calculator size={24} className="text-brand-purple" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Recover wallet access',
      description: 'Our cryptographic brute-force tools automatically find opportunities to unlock hardware wallets and corrupted seed phrases.',
      icon: <Zap size={24} className="text-brand-green" />,
      color: 'bg-[#D9F950]/30'
    },
    {
      title: 'Analyze smart contracts',
      description: 'Easily reconcile complex on-chain exploit logic to identify vulnerabilities and prevent further losses.',
      icon: <FileText size={24} className="text-blue-500" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Freeze accounts in minutes',
      description: 'Generate comprehensive forensic reports that you can hand to law enforcement or exchanges to freeze funds instantly.',
      icon: <Clock size={24} className="text-orange-500" />,
      color: 'bg-orange-100'
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6">
            We do the tracing,<br/>you regain control.
          </h2>
          <p className="text-lg text-brand-text-gray">
            Navigating a cyber incident is complicated. Our automated forensic engine handles the complexity so you can focus on recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Subtle hover background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"></div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">{feature.title}</h3>
              <p className="text-brand-text-gray leading-relaxed text-lg">{feature.description}</p>
              
              {/* Decorative element to simulate the "bento box" illustration style */}
              <div className="mt-8 h-40 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative">
                 {/* Abstract UI representation based on index */}
                 {idx === 0 && (
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-3/4 h-24 bg-white shadow-sm rounded-lg border border-gray-100 p-4 flex flex-col justify-center">
                        <div className="h-3 w-1/2 bg-gray-200 rounded-full mb-3"></div>
                        <div className="h-6 w-1/3 bg-brand-purple rounded-md"></div>
                     </div>
                   </div>
                 )}
                 {idx === 1 && (
                   <div className="absolute inset-0 flex items-end justify-between px-4 pb-0">
                      <div className="w-1/6 h-12 bg-red-200 rounded-t-md opacity-50"></div>
                      <div className="w-1/6 h-24 bg-brand-green rounded-t-md"></div>
                      <div className="w-1/6 h-16 bg-red-200 rounded-t-md opacity-50"></div>
                      <div className="w-1/6 h-32 bg-brand-green rounded-t-md"></div>
                      <div className="w-1/6 h-8 bg-red-200 rounded-t-md opacity-50"></div>
                   </div>
                 )}
                 {idx === 2 && (
                   <div className="absolute inset-0 p-4 flex flex-col gap-2 justify-center">
                     <div className="h-8 w-full bg-white rounded shadow-sm border border-gray-100 flex items-center px-3 gap-2">
                       <div className="w-4 h-4 bg-blue-100 rounded"></div>
                       <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                     </div>
                     <div className="h-8 w-full bg-white rounded shadow-sm border border-gray-100 flex items-center px-3 gap-2">
                       <div className="w-4 h-4 bg-green-100 rounded"></div>
                       <div className="h-2 w-3/4 bg-gray-100 rounded-full"></div>
                     </div>
                   </div>
                 )}
                 {idx === 3 && (
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-20 h-24 bg-white shadow-md border border-gray-100 rounded-md transform rotate-12 relative">
                        <div className="absolute top-2 right-2 w-4 h-4 bg-orange-100 rounded-full"></div>
                        <div className="absolute bottom-2 left-2 right-2 h-2 bg-gray-100 rounded"></div>
                        <div className="absolute bottom-6 left-2 right-4 h-2 bg-gray-100 rounded"></div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
