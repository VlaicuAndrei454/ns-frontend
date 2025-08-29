// src/components/Dashboard/FinanceOverview.jsx

import React from "react";
import CustomPieChart from "../charts/CustomPieChart";
import { useCurrency } from "../../hooks/useCurrency";

// match the Home.jsx logos: green → balance, black → expenses, grey → income
const COLORS = [
  "#10b981", // green-500
  "#000000", // black
  "#71717a", // gray-500
];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const { formatCurrency } = useCurrency();

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expenses", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        totalAmount={formatCurrency(totalBalance)}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
