const fs = require('fs');
const file = 'src/layouts/DashboardLayout.tsx';
let content = fs.readFileSync(file, 'utf8');

// Imports
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';");
content = content.replace("Settings, LogOut, Search, User,", "Settings, LogOut, Search, User, Shield,");
if (!content.includes("import { supabase }")) {
  content = content.replace("import { Link, Routes, Route, useLocation } from 'react-router-dom';", "import { Link, Routes, Route, useLocation } from 'react-router-dom';\nimport { supabase } from '../lib/supabase';");
}

// State
const stateInject = `  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkAdmin();
  }, []);
`;
content = content.replace("const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);", "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n" + stateInject);

// Link
const adminLink = `          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm text-red-600 hover:bg-red-50 hover:text-red-700 mt-2">
              <Shield size={18} /> Admin Panel
            </Link>
          )}`;
content = content.replace("<Link to=\"/dashboard/settings\"", adminLink + "\n          <Link to=\"/dashboard/settings\"");

fs.writeFileSync(file, content);
