import os
import re

path = 'src/pages/dashboard/Swap.tsx'
with open(path, 'r') as f:
    content = f.read()

effect = """  useEffect(() => {
    if (userProfile && receiveToken.id === 'fiat') {
      setReceiveToken(prev => ({ ...prev, symbol: userProfile.preferred_currency || 'USD' }));
    }
  }, [userProfile]);"""

content = re.sub(r'const \[searchQuery, setSearchQuery\] = useState\(\'\'\);', r"const [searchQuery, setSearchQuery] = useState('');\n" + effect, content)

with open(path, 'w') as f:
    f.write(content)
