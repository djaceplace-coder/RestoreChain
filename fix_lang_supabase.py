import os

path = 'src/components/LanguageSwitcher.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace('''      if (!supabase) { setCurrentLang(lang); return; }
      if (!supabase) return; 
       const { data: { session } } = await supabase.auth.getSession();''', '''      if (!supabase) { setCurrentLang(lang); return; }
       const { data: { session } } = await supabase.auth.getSession();''')

content = content.replace('''       if (!supabase) { setCurrentLang(lang); return; }
      if (!supabase) return; 
       const { data: { session } } = await supabase.auth.getSession();''', '''       if (!supabase) return; 
       const { data: { session } } = await supabase.auth.getSession();''')

with open(path, 'w') as f:
    f.write(content)
