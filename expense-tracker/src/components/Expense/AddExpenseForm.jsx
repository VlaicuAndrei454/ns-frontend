import React, { useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import { EXPENSE_CATEGORIES } from "../../utils/constants";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    name: "", // Added name field
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "",
  });

  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.name.trim()) {
      alert("Please enter an expense name or description.");
      return;
    }
    if (!expense.category) {
      alert("Please select a category.");
      return;
    }
    if (!expense.amount || parseFloat(expense.amount) <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }
    onAddExpense(expense);
    // Optionally reset form:
    // setExpense({ name: "", category: "", amount: "", date: new Date().toISOString().split("T")[0], icon: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Expense Name / Description"
        placeholder="e.g., Coffee, Monthly Groceries"
        value={expense.name}
        onChange={({ target }) => handleChange("name", target.value)}
        type="text" // Explicitly set type
        required
      />

      <div className="flex items-center space-x-3">
        <EmojiPickerPopup
          icon={expense.icon}
          onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
        />
        <div className="flex-grow">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={expense.category}
            onChange={({ target }) => handleChange("category", target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="0.00"
        type="number"
        step="0.01"
        required
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        type="date"
        required
      />
      <div className="flex justify-end mt-6">
        <button type="submit" className="add-btn add-btn-fill">
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;