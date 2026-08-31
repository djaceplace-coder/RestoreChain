const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminUserDetail.tsx', 'utf8');

const target = "  const handleSimpleSystemUpdate = async";
const deleteFunc = `  const handleDeleteUser = async () => {
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
  };

`;

content = content.replace(target, deleteFunc + target);
fs.writeFileSync('src/pages/admin/AdminUserDetail.tsx', content);
console.log("Fixed!");
