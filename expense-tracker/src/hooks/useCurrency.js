import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export const useCurrency = () => {
  const { currency } = useContext(UserContext);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const fetchRate = async () => {
      if (currency === "USD") {
        setRate(1);
        console.log("Currency USD → rate forced to 1");
        return;
      }

      try {
        // Frankfurter endpoint, no API key needed
        const res = await axios.get(
          "https://api.frankfurter.app/latest",
          { params: { from: "USD", to: currency } }
        );
        console.log("Frankfurter API response:", res.data);

        // Pull the rate for your target currency
        const fetchedRate = res.data.rates?.[currency];
        if (typeof fetchedRate === "number") {
          setRate(fetchedRate);
          console.log(`Fetched USD → ${currency} rate:`, fetchedRate);
        } else {
          throw new Error("No valid rate in response");
        }
      } catch (err) {
        console.error("Error fetching exchange rate, defaulting to 1:", err);
        setRate(1);
      }
    };

    fetchRate();
  }, [currency]);

  const formatCurrency = (amount) => {
    const numeric = Number(amount) || 0;
    const converted = numeric * rate;
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(converted);
  };

  return { currency, rate, formatCurrency };
};
