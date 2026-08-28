import os

path = 'src/components/LanguageSwitcher.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace("       if (!supabase) { setCurrentLang(lang); return; }", "")

with open(path, 'w') as f:
    f.write(content)
