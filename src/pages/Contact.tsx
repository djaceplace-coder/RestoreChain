export default function Contact() {
  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-display font-bold text-brand-dark mb-6">Get in Touch</h1>
          <p className="text-xl text-brand-text-gray mb-10 leading-relaxed">
            If you've lost access to your digital assets or suffered a breach, time is of the essence. Reach out to our experts immediately.
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-brand-dark mb-1">General Inquiries</h4>
              <p className="text-brand-text-gray">info@tracefield.co.uk</p>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-1">Emergency Recovery</h4>
              <p className="text-brand-text-gray">info@tracefield.co.uk</p>
            </div>
            <div>
              <h4 className="font-bold text-brand-dark mb-1">Global HQ</h4>
              <p className="text-brand-text-gray">London, United Kingdom</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Case Details</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all" placeholder="Briefly describe what happened..." />
            </div>
            <button className="w-full bg-brand-purple text-white px-6 py-4 rounded-xl font-bold hover:bg-brand-purple/90 transition-colors">
              Submit Case Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
