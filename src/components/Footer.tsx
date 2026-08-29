import { Link } from 'react-router-dom';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';

export default function Footer() {
  const { isInstallable, installPWA } = usePWAInstall();

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              
              <img src="https://mfreznxsaybjvbhw.public.blob.vercel-storage.com/Tracefieldlogo.png" alt="Tracefield Logo" className="h-8 w-auto" />
            <span className="font-display font-bold text-xl tracking-tight text-brand-dark">Tracefield</span>
            </div>
            <p className="text-brand-text-gray mb-4 max-w-sm">
              The premier digital asset recovery and blockchain forensic security platform.
            </p>
            <div className="mb-8">
              <p className="text-brand-text-gray text-sm mb-1">Email: <a href="mailto:info@tracefield.co.uk" className="hover:text-brand-purple">info@tracefield.co.uk</a></p>
              <p className="text-brand-text-gray text-sm">Location: London, UK</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={installPWA}
                className="bg-brand-dark text-white px-6 py-3 rounded-xl flex items-center gap-3 hover:bg-black transition-colors font-bold shadow-sm"
              >
                <Download size={20} />
                Install App
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-dark mb-4">Services</h4>
            <ul className="space-y-3">
              <li><a href="/services" className="text-brand-text-gray hover:text-brand-purple">Asset Tracing</a></li>
              <li><a href="/services" className="text-brand-text-gray hover:text-brand-purple">Wallet Recovery</a></li>
              <li><a href="/services" className="text-brand-text-gray hover:text-brand-purple">Smart Contract Audits</a></li>
              <li><a href="/services" className="text-brand-text-gray hover:text-brand-purple">Incident Response</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-brand-dark mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-brand-text-gray hover:text-brand-purple">Security Guide</a></li>
              <li><a href="#" className="text-brand-text-gray hover:text-brand-purple">Help Center</a></li>
              <li><a href="#" className="text-brand-text-gray hover:text-brand-purple">Blog</a></li>
              <li><a href="#" className="text-brand-text-gray hover:text-brand-purple">Case Studies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-dark mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-brand-text-gray hover:text-brand-purple">About Us</Link></li>
              <li><a href="#" className="text-brand-text-gray hover:text-brand-purple">Careers</a></li>
              <li><Link to="/privacy" className="text-brand-text-gray hover:text-brand-purple">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-brand-text-gray hover:text-brand-purple">Terms of Service</Link></li>
              <li><Link to="/carriers" className="text-brand-text-gray hover:text-brand-purple">SMS & Carrier Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-brand-text-gray">
            © {new Date().getFullYear()} Tracefield Ltd. All rights reserved.
          </p>
          <div className="text-sm text-brand-text-gray text-center md:text-left max-w-2xl">
            Disclaimer: Tracefield is a private security firm. We do not provide financial or investment advice.
          </div>
        </div>
      </div>
    </footer>
  );
}
