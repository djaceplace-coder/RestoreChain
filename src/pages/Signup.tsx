import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center overflow-hidden bg-[#0A0A0F] py-12">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-brand-purple rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#3B82F6] rounded-full blur-[140px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#10B981] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="bg-white p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-[460px] relative z-10 mx-4">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">RestoreChain</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Create account</h1>
          <p className="text-brand-text-gray mt-2 text-sm">Join the leading network in digital asset forensics</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="firstName">First name</label>
              <input 
                id="firstName" 
                type="text" 
                required 
                placeholder="Jane" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="lastName">Last name</label>
              <input 
                id="lastName" 
                type="text" 
                required 
                placeholder="Doe" 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">Email address</label>
            <input 
              id="email" 
              type="email" 
              required 
              placeholder="name@company.com" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
            />
          </div>

          <button type="submit" className="w-full bg-brand-dark text-white font-bold py-4 px-4 rounded-xl hover:bg-black transition-colors mt-6">
            Create Account
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-dark font-bold hover:underline">Log in</Link>
        </div>
      </div>

      {/* Disclaimers outside card */}
      <div className="relative z-10 mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto">
        When you create a RestoreChain account, you agree to the <Link to="/terms" className="underline hover:text-white transition-colors">Terms</Link> and <Link to="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
      </div>
    </div>
  );
}
