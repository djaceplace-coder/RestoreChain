const fs = require('fs');

let code = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

// Add useEffect, supabase, and Loader2 imports if missing
if (!code.includes('useEffect')) {
  code = code.replace('import React, { useState }', 'import React, { useState, useEffect }');
}
if (!code.includes('Loader2')) {
  code = code.replace('import { ', 'import { Loader2, ');
}
if (!code.includes("import { supabase }")) {
  code = code.replace("import { Link,", "import { supabase } from '../lib/supabase';\nimport { Link,");
}

// Inject admin check logic
const hookStart = '  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);';
const adminLogic = `  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

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
  }, []);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  if (isAdmin === false) {
    return <Navigate to="/dashboard" replace />;
  }`;

code = code.replace(hookStart, adminLogic);

fs.writeFileSync('src/layouts/AdminLayout.tsx', code);
