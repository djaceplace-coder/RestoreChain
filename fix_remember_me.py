import os
import re

path = 'src/pages/Login.tsx'
with open(path, 'r') as f:
    content = f.read()

# Add useEffect for initial load
effect_replacement = """  const [rememberMe, setRememberMe] = useState(false);
  
  useEffect(() => {
    const savedEmail = localStorage.getItem("tracefield_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);"""
content = re.sub(r'const \[rememberMe, setRememberMe\] = useState\(false\);', effect_replacement, content)

# Update submit logic
submit_replacement = """    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (rememberMe) {
      localStorage.setItem("tracefield_remember_email", email);
    } else {
      localStorage.removeItem("tracefield_remember_email");
    }

    if (error) {"""
content = re.sub(r'const \{ error \} = await supabase\.auth\.signInWithPassword\(\{ email, password \}\);\s*if \(rememberMe\) \{\s*localStorage\.setItem\("tracefield_remember_me", "true"\);\s*\} else \{\s*localStorage\.setItem\("tracefield_remember_me", "false"\);\s*\}\s*if \(error\) \{', submit_replacement, content)

with open(path, 'w') as f:
    f.write(content)
