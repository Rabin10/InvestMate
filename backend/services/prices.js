import axios from "axios";

const API_KEY = process.env.FINNHUB_API_KEY;

// Convert simple symbols like "BTC" → "BINANCE:BTCUSDT"
function normalizeSymbol(symbol, assetType) {
  symbol = symbol.toUpperCase();

  if (assetType === "Crypto") {
    // If user already typed full Finnhub symbol, don't modify
    if (symbol.includes(":")) return symbol;

    // Auto-append for Binance crypto pairs
    return `BINANCE:${symbol}USDT`;
  }

  // For stocks/ETFs, keep the symbol unchanged
  return symbol;
}

export async function getCurrentPrice(rawSymbol, assetType = "Stock") {
  if (!API_KEY) {
    return 100 + Math.random() * 50;
  }

  const symbol = normalizeSymbol(rawSymbol, assetType);

  try {
    const resp = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol,
        token: API_KEY,
      },
    });

    const price = resp.data?.c;
    return price ? parseFloat(price) : 0;
  } catch (err) {
    console.error("Finnhub price API error for", symbol, err.message);
    return 0;
  }
}
