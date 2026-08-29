import { useState, useEffect, useCallback } from 'react';
import { fetchLiveCoins, LiveCoin, getCoinPriceFromList, calculateBtcEquivalent } from '../lib/prices';
import { COINS } from '../data/coins';

export function useLivePrices(refreshIntervalMs = 45000) {
  const [coins, setCoins] = useState<LiveCoin[]>(() =>
    COINS.map((c) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      price: c.price,
      change24h: c.change24h,
      marketCap: c.marketCap,
    }))
  );
  const [btcPrice, setBtcPrice] = useState<number>(() => {
    const btc = COINS.find((c) => c.symbol === 'BTC');
    return btc?.price || 88500;
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadPrices = useCallback(async () => {
    try {
      const data = await fetchLiveCoins();
      if (data && data.length > 0) {
        setCoins(data);
        const btc = data.find((c) => c.symbol === 'BTC');
        if (btc && btc.price > 0) {
          setBtcPrice(btc.price);
        }
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to load prices in hook', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [loadPrices, refreshIntervalMs]);

  const getPrice = useCallback(
    (symbol: string, defaultVal = 0) => {
      return getCoinPriceFromList(coins, symbol, defaultVal);
    },
    [coins]
  );

  const getBtcEquivalent = useCallback(
    (usdAmount: number) => {
      return calculateBtcEquivalent(usdAmount, btcPrice);
    },
    [btcPrice]
  );

  return {
    coins,
    btcPrice,
    loading,
    lastUpdated,
    refresh: loadPrices,
    getPrice,
    getBtcEquivalent,
  };
}
