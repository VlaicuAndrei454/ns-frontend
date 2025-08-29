// src/components/Charts/CustomPieChart.jsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import CustomLegend from './CustomLegend';
import CustomTooltip from './CustomTooltip';
import { chartColors } from '../../utils/chartColors';

/**
 * default name → color mapping for your three summary slices
 */
const getSliceColor = (name) => {
  switch (name) {
    case 'Total Income':
      return chartColors[1];   // gray
    case 'Total Expenses':
      return chartColors[2];   // black
    default:
      return chartColors[0];   // green
  }
};

const CustomPieChart = ({
  data,
  totalAmount,
  showTextAnchor,
  /** optional override array of hex colors */
  colors,
}) => (
  <ResponsiveContainer width="100%" height={380}>
    <PieChart>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        innerRadius={60}
        paddingAngle={2}
        labelLine={true}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, i) => {
          const fill = colors
            ? colors[i % colors.length]
            : getSliceColor(entry.name);
          return <Cell key={`slice-${i}`} fill={fill} />;
        })}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      {showTextAnchor && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill={chartColors[2]}  /* always black */
          fontSize="24px"
        >
          {totalAmount}
        </text>
      )}
      <Legend content={<CustomLegend colors={colors || chartColors} />} />
    </PieChart>
  </ResponsiveContainer>
);

export default CustomPieChart;
