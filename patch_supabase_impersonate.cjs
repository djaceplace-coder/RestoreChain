const fs = require('fs');
let content = fs.readFileSync('src/lib/supabase.ts', 'utf8');

if (!content.includes('impersonated_user_id')) {
content += `
if (supabase) {
  const originalGetUser = supabase.auth.getUser.bind(supabase.auth);
  supabase.auth.getUser = async (...args) => {
    const impersonatedId = sessionStorage.getItem('impersonated_user_id');
    if (impersonatedId) {
      return { data: { user: { id: impersonatedId, email: sessionStorage.getItem('impersonated_user_email') || '' } as any }, error: null };
    }
    return originalGetUser(...args);
  };

  const originalGetSession = supabase.auth.getSession.bind(supabase.auth);
  supabase.auth.getSession = async (...args) => {
    const impersonatedId = sessionStorage.getItem('impersonated_user_id');
    if (impersonatedId) {
      return { data: { session: { user: { id: impersonatedId, email: sessionStorage.getItem('impersonated_user_email') || '' } as any } as any }, error: null };
    }
    return originalGetSession(...args);
  };
}
`;
  fs.writeFileSync('src/lib/supabase.ts', content);
  console.log('patched supabase.ts');
}
