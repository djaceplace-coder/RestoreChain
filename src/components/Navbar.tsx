import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  const toggleMobileDropdown = (name: string) => {
    setMobileDropdown(mobileDropdown === name ? null : name);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={closeMenu}>
            
            <img src="https://mfreznxsaybjvbhw.public.blob.vercel-storage.com/Tracefieldlogo.png" alt="Tracefield Logo" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">Tracefield</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Features Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-brand-text-gray hover:text-brand-purple transition-colors py-8 focus:outline-none">
                Features <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block w-[600px] bg-white shadow-2xl border border-gray-100 rounded-2xl p-6 z-50">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <Link to="/how-it-works" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">How it works</span></Link>
                  <Link to="/integrations" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Integrations</span></Link>
                  <Link to="/calculator" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Recovery Calculator</span></Link>
                  <Link to="/professionals" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Security Professionals</span></Link>
                  <Link to="/prices" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Crypto Prices</span></Link>
                  <Link to="/wallet-lookup" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Crypto Wallet Lookup</span></Link>
                  <Link to="/portfolio-tracker" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Portfolio Tracker</span></Link>
                  <Link to="/professionals" className="flex flex-col hover:bg-gray-50 p-2 rounded-lg transition-colors"><span className="font-bold text-brand-dark">Find an Investigator</span></Link>
                </div>
              </div>
            </div>

            {/* Learn Dropdown */}
            <div className="group relative">
              <button className="flex items-center gap-1 text-sm font-medium text-brand-text-gray hover:text-brand-purple transition-colors py-8 focus:outline-none">
                Learn <ChevronDown size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block w-[300px] bg-white shadow-2xl border border-gray-100 rounded-2xl p-4 z-50">
                <div className="flex flex-col gap-2">
                  <Link to="/guide" className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-brand-dark transition-colors">Security Guide</Link>
                  <Link to="/glossary" className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-brand-dark transition-colors">Crypto Glossary</Link>
                  <Link to="/blog" className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-brand-dark transition-colors">Blog</Link>
                  <Link to="/support" className="px-4 py-2 hover:bg-gray-50 rounded-lg font-medium text-brand-dark transition-colors">Support</Link>
                </div>
              </div>
            </div>

            <Link to="/pricing" className="text-sm font-medium text-brand-text-gray hover:text-brand-purple transition-colors">Pricing</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <LanguageSwitcher isDark={false} />
            <Link to="/login" className="text-sm font-medium text-brand-text-gray hover:text-brand-dark transition-colors">Sign in</Link>
            <Link to="/signup" className="bg-brand-purple text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-brand-purple/90 transition-colors flex items-center gap-2">
              Start for free <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-brand-dark hover:text-brand-purple focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/20 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                
                <img src="https://mfreznxsaybjvbhw.public.blob.vercel-storage.com/Tracefieldlogo.png" alt="Tracefield Logo" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">Tracefield</span>
              </Link>
              <button onClick={closeMenu} className="p-2 text-gray-500 hover:text-brand-dark rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 py-4 px-4 flex flex-col gap-2">
              {/* Features Accordion */}
              <div>
                <button 
                  onClick={() => toggleMobileDropdown('features')}
                  className="flex justify-between items-center w-full py-3 text-lg font-medium text-brand-dark"
                >
                  Features
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ${mobileDropdown === 'features' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'features' && (
                  <div className="flex flex-col pl-4 border-l-2 border-gray-100 ml-2 space-y-3 py-2 mt-1 mb-2">
                    <Link to="/how-it-works" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">How it works</Link>
                    <Link to="/integrations" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Integrations</Link>
                    <Link to="/calculator" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Recovery Calculator</Link>
                    <Link to="/professionals" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Security Professionals</Link>
                    <Link to="/prices" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Crypto prices</Link>
                    <Link to="/wallet-lookup" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Crypto wallet lookup</Link>
                    <Link to="/portfolio-tracker" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Portfolio tracker</Link>
                    <Link to="/professionals" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Find an Investigator</Link>
                  </div>
                )}
              </div>

              {/* Learn Accordion */}
              <div>
                <button 
                  onClick={() => toggleMobileDropdown('learn')}
                  className="flex justify-between items-center w-full py-3 text-lg font-medium text-brand-dark"
                >
                  Learn
                  <ChevronDown size={20} className={`text-gray-400 transition-transform ${mobileDropdown === 'learn' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'learn' && (
                  <div className="flex flex-col pl-4 border-l-2 border-gray-100 ml-2 space-y-3 py-2 mt-1 mb-2">
                    <Link to="/guide" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Security guide</Link>
                    <Link to="/glossary" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Crypto glossary</Link>
                    <Link to="/blog" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Blog</Link>
                    <Link to="/support" onClick={closeMenu} className="text-brand-text-gray hover:text-brand-purple font-medium">Support</Link>
                  </div>
                )}
              </div>

              <Link to="/pricing" onClick={closeMenu} className="block py-3 text-lg font-medium text-brand-dark mt-2">Pricing</Link>
              <Link to="/login" onClick={closeMenu} className="block py-3 text-lg font-medium text-brand-dark">Sign in</Link>
            </div>

            {/* Mobile Menu Footer CTA */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <Link to="/signup" onClick={closeMenu} className="w-full block text-center border border-gray-300 text-brand-dark font-semibold py-3 rounded-full hover:bg-gray-100 transition-colors">
                Start for free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
