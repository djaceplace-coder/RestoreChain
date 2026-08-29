import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  useEffect(() => {
    const savedEmail = localStorage.getItem("tracefield_remember_email");
    const rememberPref = localStorage.getItem("tracefield_remember_me");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(rememberPref !== "false");
    } else if (rememberPref === "false") {
      setRememberMe(false);
    }
  }, []);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured() || !supabase) {
      // Fallback for demo mode
      navigate('/dashboard');
      return;
    }
    
    // Real Supabase Login Attempt (using password since we disabled email verification)
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (rememberMe) {
      localStorage.setItem("tracefield_remember_me", "true");
      localStorage.setItem("tracefield_remember_email", email);
    } else {
      localStorage.setItem("tracefield_remember_me", "false");
      localStorage.removeItem("tracefield_remember_email");
    }

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Login successful. Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center overflow-hidden bg-[#0A0A0F]">
      
      {/* Abstract Background Elements (Mesh Gradient style) */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-brand-purple rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#3B82F6] rounded-full blur-[140px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#10B981] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="bg-white p-10 sm:p-12 rounded-3xl shadow-2xl w-full max-w-[460px] relative z-10 mx-4">
        
        {/* Supabase Warning Banner */}
        {!isSupabaseConfigured() && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-xl">
            <span className="font-bold">Demo Mode:</span> Supabase is not connected. Enter any email to continue to the dashboard. To connect real users, add your Supabase credentials in the AI Studio Settings (Secrets).
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            
            <img src="https://mfreznxsaybjvbhw.public.blob.vercel-storage.com/Tracefieldlogo.png" alt="Tracefield Logo" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">Tracefield</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-brand-dark">Welcome back</h1>
          <p className="text-brand-text-gray mt-2 text-sm">Sign in to your client portal</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.14 18.63 6.71 16.7 5.84 14.11H2.15V16.97C3.97 20.59 7.7 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.11C5.62 13.45 5.49 12.74 5.49 12C5.49 11.26 5.62 10.55 5.84 9.89V7.03H2.15C1.4 8.53 0.98 10.22 0.98 12C0.98 13.78 1.4 15.47 2.15 16.97L5.84 14.11Z" fill="#FBBC05"/>
              <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.7 1 3.97 3.41 2.15 7.03L5.84 9.89C6.71 7.3 9.14 5.38 12 5.38Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.152 6.896c-.948 0-2.415-1.07-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.62-1.48 3.608-2.935 1.15-1.688 1.624-3.324 1.65-3.415-.027-.013-3.21-1.233-3.236-4.935-.026-3.09 2.52-4.57 2.637-4.648-1.439-2.09-3.635-2.376-4.437-2.43-2.08-.182-4.04 1.3-4.507 1.3z" fill="#000000"/>
              <path d="M16.143 4.417c.833-1.013 1.391-2.416 1.235-3.832-1.206.052-2.673.806-3.532 1.819-.767.896-1.43 2.337-1.248 3.727 1.353.104 2.712-.688 3.545-1.714z" fill="#000000"/>
            </svg>
            Continue with Apple
          </button>
          
          <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-5 h-5 bg-[#0052FF] rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            Continue with Coinbase
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">Email address*</label>
            <input 
              id="email" 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">Password*</label>
            <div className="relative">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-colors"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-purple focus:ring-brand-purple"
              />
              <span className="text-sm text-gray-600 font-medium">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-bold text-brand-purple hover:text-purple-700 transition-colors">
              Forgot password?
            </Link>
          </div>
          {message && (
            <div className={`p-3 text-sm rounded-xl ${message.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
          <button type="submit" className="w-full bg-brand-dark text-white font-bold py-4 px-4 rounded-xl hover:bg-black transition-colors mt-2">
            Continue
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <Link to="/signup" className="text-brand-dark font-bold hover:underline">Get started now</Link>
        </div>
      </div>

      {/* Disclaimers outside card */}
      <div className="relative z-10 mt-8 text-center text-xs text-gray-400 max-w-xs mx-auto">
        When you log in to Tracefield, you agree to the <Link to="/terms" className="underline hover:text-white transition-colors">Terms</Link> and <Link to="/privacy" className="underline hover:text-white transition-colors">Privacy Policy</Link>.
      </div>
    </div>
  );
}
