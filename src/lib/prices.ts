import { COINS, Coin } from '../data/coins';

export interface LiveCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  image?: string;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
}

let cachedCoins: LiveCoin[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30000; // 30 seconds cache to prevent 429 rate limits

export async function fetchLiveCoins(): Promise<LiveCoin[]> {
  const now = Date.now();
  if (cachedCoins && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedCoins;
  }

  // 1. Try CoinGecko
  try {
    const metaEnv = (import.meta as any).env || {};
    const apiKey = metaEnv.VITE_COINGECKO_API_KEY;
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const formatted: LiveCoin[] = data.map((d: any) => ({
          id: d.id,
          symbol: String(d.symbol).toUpperCase(),
          name: d.name,
          price: Number(d.current_price || 0),
          change24h: Number(d.price_change_percentage_24h || 0),
          marketCap: Number(d.market_cap || 0),
          image: d.image,
          high24h: Number(d.high_24h || 0),
          low24h: Number(d.low_24h || 0),
          volume24h: Number(d.total_volume || 0),
        }));

        cachedCoins = formatted;
        lastFetchTime = now;
        return formatted;
      }
    }
  } catch (err) {
    console.warn('CoinGecko fetch failed, trying fallback provider...', err);
  }

  // 2. Try Binance 24hr Ticker API Fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('https://api.binance.com/api/v3/ticker/24hr', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const usdtPairs = new Map<string, { price: number; change: number; volume: number }>();
        data.forEach((item: any) => {
          if (item.symbol && item.symbol.endsWith('USDT')) {
            const sym = item.symbol.replace('USDT', '');
            usdtPairs.set(sym, {
              price: parseFloat(item.lastPrice || '0'),
              change: parseFloat(item.priceChangePercent || '0'),
              volume: parseFloat(item.quoteVolume || '0'),
            });
          }
        });

        // Merge with COINS baseline list
        const formatted: LiveCoin[] = COINS.map((base) => {
          const ticker = usdtPairs.get(base.symbol.toUpperCase());
          if (ticker && ticker.price > 0) {
            return {
              id: base.id,
              symbol: base.symbol.toUpperCase(),
              name: base.name,
              price: ticker.price,
              change24h: ticker.change,
              marketCap: base.marketCap,
              high24h: ticker.price * 1.02,
              low24h: ticker.price * 0.98,
              volume24h: ticker.volume,
            };
          }
          return {
            id: base.id,
            symbol: base.symbol.toUpperCase(),
            name: base.name,
            price: base.price,
            change24h: base.change24h,
            marketCap: base.marketCap,
          };
        });

        cachedCoins = formatted;
        lastFetchTime = now;
        return formatted;
      }
    }
  } catch (err) {
    console.warn('Binance fetch failed, returning baseline coins...', err);
  }

  // 3. Fallback to COINS data
  const fallback: LiveCoin[] = COINS.map((c) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    price: c.price,
    change24h: c.change24h,
    marketCap: c.marketCap,
  }));
  cachedCoins = fallback;
  return fallback;
}

export function getCoinPriceFromList(coins: LiveCoin[], symbol: string, defaultPrice = 0): number {
  if (!symbol) return defaultPrice;
  const sym = symbol.toUpperCase().trim();
  const coin = coins.find((c) => c.symbol === sym || c.name.toUpperCase() === sym);
  if (coin && coin.price > 0) {
    return coin.price;
  }
  if (sym === 'USD' || sym === 'USDT' || sym === 'USDC' || sym === 'DAI' || sym === 'FUSD') {
    return 1;
  }
  return defaultPrice;
}

export function calculateBtcEquivalent(totalUsdValue: number, btcPrice: number): number {
  if (!btcPrice || btcPrice <= 0) return 0;
  return totalUsdValue / btcPrice;
}
