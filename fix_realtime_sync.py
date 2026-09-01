import re

def fix_admin():
    with open('src/pages/admin/AdminUserDetail.tsx', 'r') as f:
        content = f.read()
    
    sync_code = """      fetchUserAndData();
      
      // Force real-time sync with user's dashboard via Supabase Broadcast
      const syncChannel = supabase.channel(`sync-${id}`);
      syncChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          syncChannel.send({
            type: 'broadcast',
            event: 'admin_balance_update',
            payload: { timestamp: Date.now() }
          }).then(() => {
            supabase.removeChannel(syncChannel);
          });
        }
      });
      
      setTimeout(() => {"""
      
    content = content.replace("      fetchUserAndData();\n      \n      setTimeout(() => {", sync_code)
    
    with open('src/pages/admin/AdminUserDetail.tsx', 'w') as f:
        f.write(content)

def fix_overview():
    with open('src/pages/dashboard/Overview.tsx', 'r') as f:
        content = f.read()
    
    content = content.replace("supabase.channel('overview_changes-' + Date.now())", "supabase.channel('sync-' + user.id)")
    
    insert_point = ".on('postgres_changes', { event: '*', schema: 'public', table: 'portfolios', filter: `user_id=eq.${user.id}` }, fetchUser)"
    replacement = insert_point + "\n          .on('broadcast', { event: 'admin_balance_update' }, fetchUser)"
    
    content = content.replace(insert_point, replacement)
    
    with open('src/pages/dashboard/Overview.tsx', 'w') as f:
        f.write(content)

def fix_portfolio():
    with open('src/pages/dashboard/Portfolio.tsx', 'r') as f:
        content = f.read()
        
    content = content.replace("supabase.channel('portfolio_changes-' + Date.now())", "supabase.channel('sync-' + user.id)")
    
    insert_point = ".on('postgres_changes', { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, fetchData)"
    replacement = insert_point + "\n      .on('broadcast', { event: 'admin_balance_update' }, fetchData)"
    
    content = content.replace(insert_point, replacement)
    
    with open('src/pages/dashboard/Portfolio.tsx', 'w') as f:
        f.write(content)

if __name__ == '__main__':
    fix_admin()
    fix_overview()
    fix_portfolio()
    print("Fixed real-time sync across files.")
