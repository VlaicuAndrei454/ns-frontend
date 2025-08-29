import React from "react";
import { useCurrency } from "../../hooks/useCurrency";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const ForecastChart = ({ data }) => {
  const { formatCurrency } = useCurrency();

  return (
    <div className="card mt-6">
      <h5 className="text-lg mb-2">Monthly Spend Projection</h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#555" }}
            label={{ value: "Day of Month", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            label={{ value: "Cumulative", angle: -90, position: "insideLeft", offset: 10 }}
            tickFormatter={(val) => formatCurrency(val)}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="actual"
            name="Actual Spend"
            stroke="#34d399"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Forecast"
            stroke="#A5D6A7"
            dot={false}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
