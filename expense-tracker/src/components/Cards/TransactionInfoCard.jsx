// filepath: frontend/expense-tracker/src/components/Cards/TransactionInfoCard.jsx
import React from "react";
import {
  LuUtensils,
  LuTrendingUp,
  LuTrendingDown,
  LuTrash2,
} from "react-icons/lu";
import { useCurrency } from "../../hooks/useCurrency";

const TransactionInfoCard = ({
  icon,
  title, // This will be expense.name or income.source
  category, // New prop specifically for expense category
  date,
  amount,
  type, // "income" or "expense"
  hideDeleteBtn,
  onDelete,
}) => {
  const { formatCurrency } = useCurrency();
  const getAmountStyles = () =>
    type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        {icon ? (
          React.isValidElement(icon) ? (
            icon
          ) : (
            <img src={icon} alt={title} className="w-6 h-6" />
          )
        ) : (
          <LuUtensils /> // Default icon
        )}
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">{title}</p>
          {/* Display category only for expenses and if provided */}
          {type === "expense" && category && (
            <p className="text-xs text-gray-500">{category}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}>
            <h6 className="text-xs font-medium">
              {type === "income" ? "+" : "-"} {formatCurrency(amount)}
            </h6>
            {type === "income" ? <LuTrendingUp /> : <LuTrendingDown />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfoCard;