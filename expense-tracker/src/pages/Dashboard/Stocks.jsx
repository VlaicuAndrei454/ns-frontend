// src/pages/Dashboard/Stocks.jsx

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useCurrency } from "../../hooks/useCurrency";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const STOCKS = [
  { symbol: "AAPL",  name: "Apple Inc."                },
  { symbol: "MSFT",  name: "Microsoft Corp."           },
  { symbol: "GOOGL", name: "Alphabet Inc."             },
  { symbol: "AMZN",  name: "Amazon.com Inc."           },
  { symbol: "TSLA",  name: "Tesla, Inc."               },
  { symbol: "NFLX",  name: "Netflix, Inc."             },
  { symbol: "NVDA",  name: "NVIDIA Corporation"        },
  { symbol: "META",  name: "Meta Platforms, Inc."      },
  { symbol: "JPM",   name: "JPMorgan Chase & Co."      },
  { symbol: "BAC",   name: "Bank of America Corp."     },
  { symbol: "WMT",   name: "Walmart Inc."              },
  { symbol: "DIS",   name: "The Walt Disney Company"   },
  { symbol: "V",     name: "Visa Inc."                 },
  { symbol: "MA",    name: "Mastercard Incorporated"   },
  { symbol: "UNH",   name: "UnitedHealth Group Inc."   },
  { symbol: "XOM",   name: "Exxon Mobil Corporation"   },
];

const StocksDashboard = () => {
  useUserAuth();
  const { formatCurrency } = useCurrency();
  const [quotes, setQuotes]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const symbols = STOCKS.map((s) => s.symbol);
    axiosInstance
      .get(API_PATHS.STOCKS.GET_QUOTES(symbols))
      .then((res) => setQuotes(res.data))
      .catch((err) => {
        console.error("Error fetching stock quotes:", err);
        // fallback to zero if error
        const fallback = symbols.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
        setQuotes(fallback);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout activeMenu="Stocks">
      <div className="my-5 mx-auto">
        <h3 className="text-xl mb-4">Stock Prices</h3>

        {loading ? (
          <p>Loading stock prices…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {STOCKS.map(({ symbol, name }) => (
              <div key={symbol} className="card p-4">
                <h4 className="text-lg font-semibold">{name}</h4>
                <p className="text-sm text-gray-500 mb-2">{symbol}</p>
                <span className="text-2xl">
                  {formatCurrency(quotes[symbol] || 0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StocksDashboard;
