import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Alex M.",
      role: "Exchange Executive",
      content: "Tracefield completely removed the headache from incident response. They tracked the exploited funds across multiple chains and had law enforcement packets ready in hours.",
      rating: 5,
    },
    {
      name: "Sarah T.",
      role: "Individual Investor",
      content: "I lost my hardware wallet PIN and thought my savings were gone forever. The recovery team cracked it securely within 3 days. Unbelievable service.",
      rating: 5,
    },
    {
      name: "David L.",
      role: "DeFi Protocol Lead",
      content: "Their smart contract audits are the best in the industry. They identified a reentrancy vulnerability that could have cost us millions.",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Scam Victim",
      content: "When I was phished, I was panicked. Tracefield immediately froze the funds on a centralized exchange before the attackers could withdraw them.",
      rating: 5,
    },
    {
      name: "Michael B.",
      role: "Law Enforcement",
      content: "The forensic reports they generate are court-admissible and have directly led to multiple successful seizures and arrests in our jurisdiction.",
      rating: 5,
    },
    {
      name: "Jessica W.",
      role: "Law Firm Partner",
      content: "We partner with Tracefield for all our digital asset litigation. Their chain analysis capabilities provide irrefutable evidence for our cases.",
      rating: 5,
    }
  ];

  return (
    <section className="py-24 bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Trusted by victims and institutions alike
          </h2>
          <p className="text-lg text-gray-300">
            We have recovered over $120M in stolen and lost digital assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl shadow-sm border border-white/10">
              <div className="flex text-brand-green mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-white mb-6 text-lg leading-relaxed">"{review.content}"</p>
              <div>
                <p className="font-bold text-white">{review.name}</p>
                <p className="text-sm text-gray-300">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
