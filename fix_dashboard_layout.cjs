const fs = require('fs');

const layoutPath = 'src/layouts/DashboardLayout.tsx';
let layoutCode = fs.readFileSync(layoutPath, 'utf8');

layoutCode = layoutCode.replace('  const [reconCount, setReconCount] = useState(0);\n  const [currentUser, setCurrentUser] = useState<any>(null);\n  const [reconCount, setReconCount] = useState(0);', '  const [reconCount, setReconCount] = useState(0);\n  const [currentUser, setCurrentUser] = useState<any>(null);');
layoutCode = layoutCode.replace('      const { data: { user } } = await supabase.auth.getUser();\n      if (user) {\n        const { data } = await supabase.from(\'profiles\').select(\'role\').eq(\'id\', user.id).single();', '      if (user) {\n        const { data } = await supabase.from(\'profiles\').select(\'role\').eq(\'id\', user.id).single();');

fs.writeFileSync(layoutPath, layoutCode);
