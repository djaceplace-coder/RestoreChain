const fetch = require('node-fetch');
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
  .then(res => res.json())
  .then(data => console.log(data.slice(0, 2).map(d => d.symbol)))
  .catch(console.error);
