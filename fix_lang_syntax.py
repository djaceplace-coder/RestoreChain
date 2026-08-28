import os

path = 'src/components/LanguageSwitcher.tsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace("""    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=None; Secure`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/; SameSite=None; Secure`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;
    }""", """    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; SameSite=None; Secure`;
      document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/; SameSite=None; Secure`;
    }""")

with open(path, 'w') as f:
    f.write(content)
