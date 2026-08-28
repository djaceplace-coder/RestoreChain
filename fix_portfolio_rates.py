import os
import re

path = 'src/pages/dashboard/Portfolio.tsx'
with open(path, 'r') as f:
    content = f.read()

target = """  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
  }, []);"""

replacement = """  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
    };
    init();
    
    // Fetch real-time cryptocurrency data
    const fetchLiveRates = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map((d: any) => ({
            id: d.id,
            symbol: d.symbol.toUpperCase(),
            name: d.name,
            price: d.current_price,
            change24h: d.price_change_percentage_24h,
            image: d.image
          }));
          setLiveRates(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch live rates", err);
      }
    };
    
    fetchLiveRates();
    const interval = setInterval(fetchLiveRates, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);"""

if target in content:
    content = content.replace(target, replacement)
    with open(path, 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Target not found")
