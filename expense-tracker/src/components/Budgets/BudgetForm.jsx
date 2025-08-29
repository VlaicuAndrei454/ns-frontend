import React, { useState, useEffect, useCallback } from 'react';
import Input from '../Inputs/Input'; // Assuming Input component is at src/components/Inputs/Input.jsx
import { EXPENSE_CATEGORIES } from '../../utils/constants'; // Ensure this path is correct
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { LuPlus, LuTrash2, LuInfo } from 'react-icons/lu';
import { useCurrency } from '../../hooks/useCurrency'; // For displaying spent amounts

const BudgetForm = ({ onSubmit, onCancel, initialData }) => {
  const { formatCurrency } = useCurrency();
  const [budget, setBudget] = useState({
    name: initialData?.name || 'My Budget',
    overallAmount: initialData?.overallAmount || '',
    cycleType: initialData?.cycleType || 'monthly',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '', // Only for custom cycle
    categoryAllocations: initialData?.categoryAllocations || [],
  });
  const [categorySpending, setCategorySpending] = useState({});
  const [loadingSpending, setLoadingSpending] = useState(false);

  const fetchCategorySpending = useCallback(async () => {
    setLoadingSpending(true);
    try {
      const response = await axiosInstance.get(API_PATHS.BUDGETS.GET_CATEGORY_SPENDING_LAST_30_DAYS);
      setCategorySpending(response.data || {});
    } catch (error) {
      console.error("Error fetching category spending:", error);
      toast.error("Could not load recent category spending data.");
      setCategorySpending({});
    } finally {
      setLoadingSpending(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorySpending();
  }, [fetchCategorySpending]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setBudget(prev => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (index, field, value) => {
    const newAllocations = [...budget.categoryAllocations];
    newAllocations[index][field] = field === 'amount' ? (value === '' ? '' : parseFloat(value)) : value;
    setBudget(prev => ({ ...prev, categoryAllocations: newAllocations }));
  };

  const addCategoryAllocation = () => {
    setBudget(prev => ({
      ...prev,
      categoryAllocations: [...prev.categoryAllocations, { category: '', amount: '' }],
    }));
  };

  const removeCategoryAllocation = (index) => {
    const newAllocations = budget.categoryAllocations.filter((_, i) => i !== index);
    setBudget(prev => ({ ...prev, categoryAllocations: newAllocations }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(budget.overallAmount) <= 0) {
        toast.error("Overall budget amount must be positive.");
        return;
    }
    if (budget.cycleType === 'custom' && !budget.endDate) {
        toast.error("End date is required for custom cycle type.");
        return;
    }
    if (budget.cycleType === 'custom' && new Date(budget.endDate) < new Date(budget.startDate)) {
        toast.error("End date cannot be before start date for custom cycle.");
        return;
    }

    // Filter out empty allocations before submitting
    const finalAllocations = budget.categoryAllocations.filter(
        alloc => alloc.category && (alloc.amount !== '' && parseFloat(alloc.amount) > 0)
    ).map(alloc => ({ ...alloc, amount: parseFloat(alloc.amount) }));


    const totalCategoryAllocation = finalAllocations.reduce((sum, item) => sum + item.amount, 0);
    if (totalCategoryAllocation > parseFloat(budget.overallAmount) + 0.001) { // Epsilon for float comparison
        toast.error("Total amount for category budgets cannot exceed the overall budget amount.");
        return;
    }
    
    const categoriesInAllocations = finalAllocations.map(alloc => alloc.category);
    if (new Set(categoriesInAllocations).size !== categoriesInAllocations.length) {
        toast.error("Categories within budget allocations must be unique.");
        return;
    }


    const budgetDataToSubmit = {
      ...budget,
      overallAmount: parseFloat(budget.overallAmount),
      categoryAllocations: finalAllocations,
    };
    // Backend will calculate endDate for monthly/weekly, so we don't strictly need to send it unless custom
    if (budget.cycleType !== 'custom') {
        delete budgetDataToSubmit.endDate; // Let backend calculate for non-custom
    }


    onSubmit(budgetDataToSubmit);
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(
    cat => !budget.categoryAllocations.find(alloc => alloc.category === cat)
  );


  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <Input
        label="Budget Name"
        name="name"
        value={budget.name}
        onChange={handleChange}
        placeholder="e.g., Monthly Household Budget"
        required
      />
      <Input
        label="Overall Amount"
        name="overallAmount"
        type="number"
        value={budget.overallAmount}
        onChange={handleChange}
        placeholder="0.00"
        step="0.01"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cycleType" className="block text-xs font-medium text-gray-700 mb-1">Cycle Type</label>
          <select
            id="cycleType"
            name="cycleType"
            value={budget.cycleType}
            onChange={handleChange}
            className="input-box py-2.5" // Adjusted padding to match Input
            required
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={budget.startDate}
          onChange={(e) => handleDateChange("startDate", e.target.value)}
          required
        />
      </div>

      {budget.cycleType === 'custom' && (
        <Input
          label="End Date (Custom Cycle)"
          name="endDate"
          type="date"
          value={budget.endDate}
          onChange={(e) => handleDateChange("endDate", e.target.value)}
          required
        />
      )}

      <div className="pt-2">
        <h3 className="text-base font-medium text-gray-800 mb-1">Category Allocations (Optional)</h3>
        <p className="text-xs text-gray-500 mb-3">
            Allocate specific amounts to categories. The total should not exceed the overall budget.
        </p>
        {budget.categoryAllocations.map((alloc, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end mb-3 p-3 border border-gray-200 rounded-md bg-gray-50/50">
            <div className="md:col-span-5">
              <label htmlFor={`category-${index}`} className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                id={`category-${index}`}
                name="category"
                value={alloc.category}
                onChange={(e) => handleAllocationChange(index, 'category', e.target.value)}
                className="input-box py-2.5 w-full"
              >
                <option value="">Select Category</option>
                {/* Allow selecting current category for editing, plus available ones */}
                {(alloc.category ? [alloc.category, ...availableCategories] : availableCategories).filter((v, i, a) => a.indexOf(v) === i).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-5">
              <Input
                label="Amount"
                type="number"
                value={alloc.amount}
                onChange={(e) => handleAllocationChange(index, 'amount', e.target.value)}
                placeholder="0.00"
                step="0.01"
                containerClassName="mb-0"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeCategoryAllocation(index)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Remove Category Allocation"
              >
                <LuTrash2 size={18} />
              </button>
            </div>
            {alloc.category && categorySpending[alloc.category] !== undefined && (
                 <div className="md:col-span-12 text-xs text-gray-500 flex items-center mt-1">
                    <LuInfo size={14} className="mr-1 text-blue-500" />
                    Spent in last 30 days on {alloc.category}: {formatCurrency(categorySpending[alloc.category] || 0)}
                 </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addCategoryAllocation}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-green-700 py-2 px-3 border border-dashed border-gray-300 rounded-md hover:bg-green-50"
        >
          <LuPlus /> Add Category Allocation
        </button>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="add-btn add-btn-fill">
          {initialData ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;