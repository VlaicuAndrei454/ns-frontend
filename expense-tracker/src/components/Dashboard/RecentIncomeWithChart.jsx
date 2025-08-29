// src/components/Dashboard/RecentIncomeWithChart.jsx

import React, { useEffect, useState } from "react";
import CustomPieChart from "../charts/CustomPieChart";
import { useCurrency } from "../../hooks/useCurrency";

// a range of greens from light → dark
const GREEN_SHADES = [
  "#34d399", // green-400
  "#6ee7b7", // green-300
  "#10b981", // green-500
  "#059669", // green-600
  "#047857", // green-700
];

const RecentIncomeWithChart = ({ data }) => {
  const { formatCurrency } = useCurrency();
  const [chartData, setChartData] = useState([]);
  const [totalLast60, setTotalLast60] = useState(0);

  useEffect(() => {
    // Aggregate amounts by source name
    const aggregated = data.reduce((acc, item) => {
      const name = item.source;
      const amount = item.amount;
      const existing = acc.find(e => e.name === name);
      if (existing) {
        existing.amount += amount;
      } else {
        acc.push({ name, amount });
      }
      return acc;
    }, []);
  
    setChartData(aggregated);
    setTotalLast60(
      aggregated.reduce((sum, curr) => sum + curr.amount, 0)
    );
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        totalAmount={formatCurrency(totalLast60)}
        showTextAnchor
        colors={GREEN_SHADES}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
