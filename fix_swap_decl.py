import os
import re

path = 'src/pages/dashboard/Swap.tsx'
with open(path, 'r') as f:
    content = f.read()

content = re.sub(r'const \[receiveToken, setReceiveToken\] = useState\(SWAP_TOKENS\[1\]\); // Default USDTO', '', content)

with open(path, 'w') as f:
    f.write(content)
