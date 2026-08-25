const fs = require('fs');
const adminOverviewPath = 'src/pages/admin/AdminOverview.tsx';
let adminOverviewCode = fs.readFileSync(adminOverviewPath, 'utf8');

if (!adminOverviewCode.includes('import { supabase }')) {
  adminOverviewCode = adminOverviewCode.replace("import React from 'react';", "import React, { useState, useEffect } from 'react';\nimport { supabase } from '../../lib/supabase';");
  
  // Quick stats replacement
  const effectCode = `
  const [stats, setStats] = useState({ users: 0, balance: 0, transactions: 0 });
  useEffect(() => {
    const loadStats = async () => {
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { data: profiles } = await supabase.from('profiles').select('total_balance');
      const { count: txs } = await supabase.from('transactions').select('*', { count: 'exact', head: true });
      
      const balance = profiles?.reduce((sum, p) => sum + Number(p.total_balance || 0), 0) || 0;
      setStats({ users: users || 0, balance, transactions: txs || 0 });
    };
    loadStats();
    
    const channel = supabase.channel('overview_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, loadStats)
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);
  `;
  
  adminOverviewCode = adminOverviewCode.replace("export default function AdminOverview() {", "export default function AdminOverview() {\n" + effectCode);
  adminOverviewCode = adminOverviewCode.replace("const kpis = [", "const kpis = [\n    { title: 'Total Users', value: stats.users.toString(), change: '+0', trend: 'up', icon: Users },\n    { title: 'Total AUM (USD)', value: '$' + stats.balance.toLocaleString(), change: '+0%', trend: 'up', icon: DollarSign },\n    { title: 'Total Transactions', value: stats.transactions.toString(), change: '+0', trend: 'up', icon: Activity },\n  ];\n  const dummy = [");
  
  fs.writeFileSync(adminOverviewPath, adminOverviewCode);
}
