// src/pages/Dashboard/Crypto.jsx

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axios from "axios";
import { useCurrency } from "../../hooks/useCurrency";
import CryptoChart from "../../components/Crypto/CryptoChart";

const CRYPTOS = [
  { id: "bitcoin",  name: "Bitcoin",  symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC" },
];

const CryptoDashboard = () => {
  const { formatCurrency } = useCurrency();
  const [prices, setPrices]     = useState({});
  const [history, setHistory]   = useState({});
  const [loadingHistory, setLoadingHistory] = useState(true);

  // 1. Fetch current USD prices
  useEffect(() => {
    (async () => {
      try {
        const ids = CRYPTOS.map((c) => c.id).join(",");
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          { params: { ids, vs_currencies: "usd" } }
        );
        setPrices(res.data);
      } catch (err) {
        console.error("Error loading crypto prices:", err);
      }
    })();
  }, []);

  // 2. Fetch 30-day USD history once
  useEffect(() => {
    (async () => {
      setLoadingHistory(true);
      const newHist = {};
      await Promise.all(
        CRYPTOS.map(async ({ id }) => {
          try {
            const res = await axios.get(
              `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
              { params: { vs_currency: "usd", days: 30 } }
            );
            newHist[id] = res.data.prices.map(([ts, price]) => ({
              date: new Date(ts).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              }),
              price, // price in USD
            }));
          } catch (err) {
            console.error(`Error fetching history for ${id}:`, err);
            newHist[id] = [];
          }
        })
      );
      setHistory(newHist);
      setLoadingHistory(false);
    })();
  }, []); // <-- no currency dependency

  return (
    <DashboardLayout activeMenu="Crypto">
      <div className="my-5 mx-auto">
        <h3 className="text-xl mb-4">Cryptocurrency Prices</h3>

        <div className="grid grid-cols-1 gap-6">
          {CRYPTOS.map(({ id, name, symbol }) => {
            const usd = prices[id]?.usd || 0;
            const display = formatCurrency(usd);

            return (
              <div key={id} className="card p-4">
                <h4 className="text-lg font-semibold">{name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {symbol.toUpperCase()}
                </p>
                <span className="text-2xl">{display}</span>

                {loadingHistory ? (
                  <p className="mt-2">Loading chart…</p>
                ) : (
                  history[id] && history[id].length > 0 && (
                    <CryptoChart data={history[id]} name={symbol.toUpperCase()} />
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CryptoDashboard;
