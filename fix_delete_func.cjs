const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

const oldFunc = `  const handleDeleteUser = async () => {
    if (!window.confirm("Are you SURE you want to completely delete this user and all associated data? This cannot be undone.")) return;
    
    // First, clear portfolios/wallets/txs if necessary (cascade handles most, but safe to delete from profile)
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      alert("Failed to delete user: " + error.message);
    } else {
      alert("User account successfully deleted.");
      window.location.href = '#/admin/users';
    }
  };`;

const newFunc = `  const handleDeleteUser = async () => {
    if (!window.confirm("Are you SURE you want to completely delete this user and all associated data? This cannot be undone.")) return;
    
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: id });
    if (error) {
      // Fallback: Delete profile only
      console.warn(error);
      const { error: profileErr } = await supabase.from('profiles').delete().eq('id', id);
      if (profileErr) {
         alert("Failed to delete user: " + profileErr.message);
      } else {
         alert("User profile deleted. (Run the SQL script to fully remove auth record).");
         window.location.href = '#/admin/users';
      }
    } else {
      alert("User account completely deleted.");
      window.location.href = '#/admin/users';
    }
  };`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Delete function updated to call RPC.");
