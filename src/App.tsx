/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

// New Pages
import HowItWorks from './pages/HowItWorks';
import Integrations from './pages/Integrations';
import Calculator from './pages/Calculator';
import Professionals from './pages/Professionals';
import Prices from './pages/Prices';
import WalletLookup from './pages/WalletLookup';
import PortfolioTracker from './pages/PortfolioTracker';
import Guide from './pages/Guide';
import Glossary from './pages/Glossary';
import Blog from './pages/Blog';
import Pricing from './pages/Pricing';
import Support from './pages/Support';

// Legal and Auth
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Carriers from './pages/Carriers';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import OnboardingLayout from './layouts/OnboardingLayout';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAppShell = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/onboarding');
  const hideNavAndFooter = isAuthPage || isAppShell;

  return (
    <div className="min-h-screen bg-white selection:bg-brand-purple/20 selection:text-brand-purple flex flex-col">
      <ScrollToTop />
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/wallet-lookup" element={<WalletLookup />} />
          <Route path="/portfolio-tracker" element={<PortfolioTracker />} />
          
          <Route path="/guide" element={<Guide />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/support" element={<Support />} />
          
          <Route path="/pricing" element={<Pricing />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/carriers" element={<Carriers />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Panel */}
          <Route path="/dashboard/*" element={<DashboardLayout />} />
          <Route path="/onboarding/*" element={<OnboardingLayout />} />
          
          {/* Admin Panel */}
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
