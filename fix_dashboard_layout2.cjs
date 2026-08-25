const fs = require('fs');

const layoutPath = 'src/layouts/DashboardLayout.tsx';
let layoutCode = fs.readFileSync(layoutPath, 'utf8');

const oldUseEffect = `  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        // Fetch recon count
        const fetchRecon = async () => {
          const { count } = await supabase
            .from('reconciliation_issues')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'open');
          setReconCount(count || 0);
        };
        fetchRecon();
        
        const reconChannel = supabase.channel('recon_badge_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues', filter: \`user_id=eq.\${user.id}\` }, fetchRecon)
          .subscribe();
      }
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
      // Fetch reconciliation count
      const fetchRecon = async () => {
        const { count } = await supabase
          .from('reconciliation_issues')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'open');
        setReconCount(count || 0);
      };
      if (user) fetchRecon();

      const reconChannel = supabase.channel('recon_badge')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues' }, fetchRecon)
        .subscribe();
      return () => { supabase.removeChannel(reconChannel); };
  }, [user]);`;

const newUseEffect = `  useEffect(() => {
    let reconChannel: any;

    const checkAdminAndRecon = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }

        // Fetch recon count
        const fetchRecon = async () => {
          const { count } = await supabase
            .from('reconciliation_issues')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'open');
          setReconCount(count || 0);
        };
        fetchRecon();
        
        reconChannel = supabase.channel('recon_badge_changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reconciliation_issues', filter: \`user_id=eq.\${user.id}\` }, fetchRecon)
          .subscribe();
      }
    };
    
    checkAdminAndRecon();

    return () => { 
      if (reconChannel) supabase.removeChannel(reconChannel); 
    };
  }, []);`;

// It's possible the exact string matching might fail due to formatting. Let's do a regex replacement.
// Let's replace the whole block from "useEffect(() => {" to "  }, [user]);"
layoutCode = layoutCode.replace(/  useEffect\(\(\) => \{[\s\S]*?\}, \[user\]\);/, newUseEffect);

fs.writeFileSync(layoutPath, layoutCode);
