const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminCreateUserModal.tsx', 'utf8');

content = content.replace(
`import { X } from 'lucide-react';`,
`import { X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';`
);

content = content.replace(
/  const handleSubmit = \(e: React\.FormEvent\) => {[\s\S]*?onUserCreated\(newUser\);\n  };/,
`  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
      const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
      
      // Create a temporary client that DOES NOT persist session so we don't log the admin out
      const tempSupabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      });

      const { data, error: signUpError } = await tempSupabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error("Failed to create user");

      const userId = data.user.id;
      
      // Now use the main admin client to update their profile
      await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        total_balance: Number(initialBalance) || 0
      }).eq('id', userId);

      // Add a system transaction if balance provided
      if (Number(initialBalance) > 0) {
        await supabase.from('transactions').insert({
          user_id: userId,
          type: 'deposit',
          amount: \`+$\${Number(initialBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}\`,
          value_usd: Number(initialBalance),
          asset: 'USD',
          status: 'completed',
        });
      }

      onUserCreated({ id: userId, email });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };`
);

content = content.replace(
/Cancel<\/button>/,
`Cancel</button>
            {error && <p className="text-red-500 text-xs absolute left-6 bottom-8">{error}</p>}`
);

content = content.replace(
/<button type="submit" className="px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl">Create Account<\/button>/,
`<button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-xl disabled:opacity-50">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>`
);

fs.writeFileSync('src/pages/admin/AdminCreateUserModal.tsx', content);
console.log('patched AdminCreateUserModal');
