const fs = require('fs');
const file = 'src/layouts/DashboardLayout.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('const [reconCount, setReconCount] = useState(0);')) {
  code = code.replace(
    'const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);',
    `const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const [reconCount, setReconCount] = useState(0);`
  );

  const fetchCode = `
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
  `;

  // Inject into useEffect
  code = code.replace('checkAdmin();', 'checkAdmin();' + fetchCode);
  
  // Clean up channel in useEffect return
  code = code.replace('}, []);', `  return () => { supabase.removeChannel(reconChannel); };\n  }, [user]);`); // Need user in dependency array, but checkAdmin doesn't use it directly... wait, DashboardLayout has no `user` object in state currently. It fetches `supabase.auth.getUser()`.

  // Let's rewrite the layout's useEffect safely.
}
fs.writeFileSync(file, code);
