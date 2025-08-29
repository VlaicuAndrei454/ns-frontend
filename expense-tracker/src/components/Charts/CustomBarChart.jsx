// src/components/Charts/CustomBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCurrency } from "../../hooks/useCurrency";

// two-tone green palette for bars
const barColors = [
  "#10b981", // green-500
  "#6ee7b7", // green-300
];

const CustomBarChart = ({ data }) => {
  const { formatCurrency } = useCurrency();

  // Decide X-axis field: prefer 'date' (for daily charts), then 'month', then 'category'
  const xKey =
    data.length > 0
      ? data[0].date
        ? "date"
        : data[0].month
        ? "month"
        : "category"
      : "category";

  // Show the item's source/category in the tooltip
  const CustomTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      // pick whichever label field exists
      const label = item.source ?? item.category ?? item[xKey] ?? "";

      return (
        <div className="bg-gray-50 shadow-lg rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-gray-700 mb-1">
            {label}
          </p>
          <p className="text-sm text-gray-600">
            Amount:{" "}
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(item.amount)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey={xKey}
          stroke="#52525b"
          // optional: format date ticks if needed
          // tickFormatter={xKey === "date" ? (d) => new Date(d).toLocaleDateString() : undefined}
        />
        <YAxis
          stroke="#52525b"
          tickFormatter={(val) => formatCurrency(val)}
        />
        <Tooltip content={<CustomTooltipContent />} />
        <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={barColors[idx % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
