const fs = require('fs');
let content = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

content = content.replace(
`  const [supportQueueCount, setSupportQueueCount] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      setIsAdmin(data?.is_admin === true);
    };
    checkAdmin();
    
    // Fetch unique users in support
    const fetchSupportCount = async () => {
      const { count } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
      setSupportQueueCount(count || 0);
    };
    fetchSupportCount();
    
    const channel = supabase.channel('layout_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchSupportCount)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);`,
`  const [supportQueueCount, setSupportQueueCount] = useState(0);
  const [pendingKycCount, setPendingKycCount] = useState(0);

  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
      setIsAdmin(data?.is_admin === true);
    };
    checkAdmin();
    
    const fetchCounts = async () => {
      // Support
      const { count: supportCount } = await supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open');
      setSupportQueueCount(supportCount || 0);

      // KYC
      const { count: kycCount } = await supabase.from('kyc_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      const { count: ndaCount } = await supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      setPendingKycCount((kycCount || 0) + (ndaCount || 0));
    };

    fetchCounts();
    
    const channel1 = supabase.channel('layout_support')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, fetchCounts)
      .subscribe();
      
    const channel2 = supabase.channel('layout_kyc')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kyc_documents' }, fetchCounts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_documents' }, fetchCounts)
      .subscribe();
      
    return () => { 
      supabase.removeChannel(channel1); 
      supabase.removeChannel(channel2);
    };
  }, []);`
);

content = content.replace(
`          <Link to="/admin/kyc" onClick={closeMobileMenu} className={navLinkClass('/admin/kyc')}>
            <ShieldAlert size={18} /> KYC Approvals
          </Link>`,
`          <Link to="/admin/kyc" onClick={closeMobileMenu} className={navLinkClass('/admin/kyc')}>
            <ShieldAlert size={18} /> KYC Approvals
            {pendingKycCount > 0 && <span className="ml-auto bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{pendingKycCount}</span>}
          </Link>`
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', content);
console.log('patched');
