import os
import re

path = 'src/components/LanguageSwitcher.tsx'
with open(path, 'r') as f:
    content = f.read()

replacement = """    if (langCode === 'en') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=None; Secure`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/; SameSite=None; Secure`;
    }"""

content = re.sub(r'if \(langCode === \'en\'\) \{[\s\S]*?path=/;`;\s*\}', replacement, content)

with open(path, 'w') as f:
    f.write(content)
