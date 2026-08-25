const fs = require('fs');

let dbCode = fs.readFileSync('src/layouts/DashboardLayout.tsx', 'utf8');
if (!dbCode.includes('const mainRef = useRef')) {
  dbCode = dbCode.replace("const [currentUser, setCurrentUser] = useState<any>(null);", "const [currentUser, setCurrentUser] = useState<any>(null);\n  const mainRef = useRef<HTMLElement>(null);");
}
fs.writeFileSync('src/layouts/DashboardLayout.tsx', dbCode);

let sbCode = fs.readFileSync('src/lib/supabase.ts', 'utf8');
sbCode = sbCode.replace("import.meta.env.VITE_SUPABASE_URL", "(import.meta as any).env.VITE_SUPABASE_URL");
sbCode = sbCode.replace("import.meta.env.VITE_SUPABASE_ANON_KEY", "(import.meta as any).env.VITE_SUPABASE_ANON_KEY");
fs.writeFileSync('src/lib/supabase.ts', sbCode);

let adCode = fs.readFileSync('src/pages/admin/AdminSupport.tsx', 'utf8');
adCode = adCode.replace("email: m.profiles?.email || 'Unknown',", "email: (m.profiles as any)?.email || 'Unknown',");
fs.writeFileSync('src/pages/admin/AdminSupport.tsx', adCode);
