const fs = require('fs');
let layout = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');

// Add kyc_status state
layout = layout.replace(
  `const [currentUser, setCurrentUser] = useState<any>(null);`,
  `const [currentUser, setCurrentUser] = useState<any>(null);\n  const [kycStatus, setKycStatus] = useState<string>('unverified');`
);

// Update fetch to get kyc_status
const oldFetch = `const { data: profile } = await supabase.from('profiles').select('email, role').eq('id', user.id).single();`;
const newFetch = `const { data: profile } = await supabase.from('profiles').select('email, role, kyc_status').eq('id', user.id).single();
      if (profile?.kyc_status) setKycStatus(profile.kyc_status);`;
layout = layout.replace(oldFetch, newFetch);

// Add Agreement link to sidebar
const portfolioLink = `<Link to="/dashboard" onClick={closeMobileMenu} className={navLinkClass('/dashboard')}>`;
const agreementLink = `{kycStatus !== 'approved' && (
          <Link to="/dashboard/agreement" onClick={closeMobileMenu} className={navLinkClass('/dashboard/agreement')}>
            <FileText size={18} className="text-orange-500" /> Action Required: NDA
          </Link>
          )}
          <Link to="/dashboard" onClick={closeMobileMenu} className={navLinkClass('/dashboard', true)}>`;

layout = layout.replace(portfolioLink, agreementLink);

// Add Route to Agreement
const routes = `<Route path="/" element={<Portfolio />} />`;
const newRoutes = `<Route path="/" element={<Portfolio />} />\n            <Route path="/agreement" element={<Agreement />} />`;
layout = layout.replace(routes, newRoutes);

// Import Agreement
layout = `import Agreement from '../pages/dashboard/Agreement';\n` + layout;

fs.writeFileSync('src/layouts/DashboardLayout.tsx', layout);
console.log('Layout updated');
