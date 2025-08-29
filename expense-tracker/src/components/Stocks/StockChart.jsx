import React from "react";
import { useCurrency } from "../../hooks/useCurrency";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const StockChart = ({ data, name }) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="w-full h-64 mt-4">
      <h6 className="text-sm mb-2">{name} (30d)</h6>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickFormatter={(d) => d}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(val) => formatCurrency(val)}
          />
          <Tooltip
            formatter={(value) => formatCurrency(value)}
            labelFormatter={(label) => label}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#555"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
