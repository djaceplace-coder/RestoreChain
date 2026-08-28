import os

path = 'src/pages/dashboard/Portfolio.tsx'
with open(path, 'r') as f:
    content = f.read()

# Remove the broken handleActionWithKYC
broken_func = """  const handleActionWithKYC = (action: () => void) => {
    if (userProfile?.kyc_status === 'approved') {
      action();
    } else {
      setIsKYCRestrictedOpen(true);
    }
  };"""
content = content.replace(broken_func, "")

# Add it after isKYCModalOpen
correct_func = """  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);

  const handleActionWithKYC = (action: () => void) => {
    if (userProfile?.kyc_status === 'approved') {
      action();
    } else {
      setIsKYCRestrictedOpen(true);
    }
  };"""
content = content.replace("  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);", correct_func)

with open(path, 'w') as f:
    f.write(content)
