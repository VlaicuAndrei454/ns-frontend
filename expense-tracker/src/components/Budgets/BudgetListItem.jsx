import React, { useState, useEffect, useCallback } from 'react';
import { LuPencil, LuTrash2, LuChevronDown, LuChevronUp, LuTarget, LuDollarSign, LuActivity } from 'react-icons/lu';
import { useCurrency } from '../../hooks/useCurrency';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const ProgressBar = ({ value, max, colorClass = 'bg-green-500' }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  // Ensure percentage is not negative
  const displayPercentage = Math.max(0, percentage);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`${colorClass} h-2.5 rounded-full`}
        style={{ width: `${displayPercentage}%` }}
      ></div>
    </div>
  );
};

const BudgetListItem = ({ budget: initialBudget, onEdit, onDelete }) => {
  const { formatCurrency } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(false);
  const [budgetDetails, setBudgetDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchBudgetDetails = useCallback(async (id) => {
    if (!id) return;
    setLoadingDetails(true);
    try {
      const response = await axiosInstance.get(API_PATHS.BUDGETS.GET_ONE(id));
      setBudgetDetails(response.data);
    } catch (error) {
      console.error("Error fetching budget details:", error);
      toast.error(error.response?.data?.message || "Failed to load budget details.");
      setBudgetDetails(null); // Reset on error
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    if (initialBudget && isExpanded && initialBudget._id && !budgetDetails) {
        fetchBudgetDetails(initialBudget._id);
    }
  }, [initialBudget, isExpanded, budgetDetails, fetchBudgetDetails]);


  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (newExpandedState && !budgetDetails && initialBudget?._id) {
      fetchBudgetDetails(initialBudget._id);
    }
  };
  
  const budgetToDisplay = budgetDetails || initialBudget;

  const getCycleText = (cycle) => {
    switch (cycle) {
      case 'monthly': return 'Monthly';
      case 'weekly': return 'Weekly';
      case 'custom': return 'Custom Period';
      default: return 'N/A';
    }
  };

  // Calculate overallRemaining based on the most up-to-date data
  const overallAmountForCalc = budgetDetails?.overallAmount ?? initialBudget.overallAmount;
  const totalSpentOverallForCalc = budgetDetails?.totalSpentOverall ?? initialBudget?.totalSpentOverall ?? 0;
  const overallRemainingFromDetails = budgetDetails ? budgetDetails.overallAmount - budgetDetails.totalSpentOverall : null;
  const overallRemainingFromInitial = initialBudget?.totalSpentOverall !== undefined ? initialBudget.overallAmount - initialBudget.totalSpentOverall : null;
  const displayOverallRemaining = overallRemainingFromDetails ?? overallRemainingFromInitial;


  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 cursor-pointer hover:bg-gray-50/70" onClick={toggleExpand}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-md font-semibold text-gray-800">{initialBudget.name}</h3>
            <p className="text-xs text-gray-500">
              {getCycleText(initialBudget.cycleType)}: {new Date(initialBudget.startDate).toLocaleDateString()} - {new Date(initialBudget.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-100"
              title="Edit Budget"
            >
              <LuPencil size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100"
              title="Delete Budget"
            >
              <LuTrash2 size={16} />
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 p-1.5"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <LuChevronUp size={18} /> : <LuChevronDown size={18} />}
            </button>
          </div>
        </div>
        <div className="mt-3">
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-600">Overall Budget: {formatCurrency(initialBudget.overallAmount)}</span>
                {(displayOverallRemaining !== null) && (
                    <span className={`font-medium ${displayOverallRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {displayOverallRemaining < 0 ? `Overspent by ${formatCurrency(Math.abs(displayOverallRemaining))}` : `${formatCurrency(displayOverallRemaining)} Remaining`}
                    </span>
                )}
            </div>
            <ProgressBar value={totalSpentOverallForCalc} max={overallAmountForCalc} />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50/30">
          {loadingDetails && <p className="text-xs text-gray-500 text-center py-2">Loading details...</p>}
          {!loadingDetails && budgetDetails && (
            <>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <p className="flex items-center"><LuTarget className="mr-1.5 flex-shrink-0" /> Budgeted: {formatCurrency(budgetDetails.overallAmount)}</p>
                    <p className="flex items-center"><LuActivity className="mr-1.5 flex-shrink-0" /> Spent: {formatCurrency(budgetDetails.totalSpentOverall)}</p>
                    <p className={`flex items-center col-span-1 sm:col-span-2 ${(budgetDetails.overallAmount - budgetDetails.totalSpentOverall) < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        <LuDollarSign className="mr-1.5 flex-shrink-0" /> Remaining: {formatCurrency(budgetDetails.overallAmount - budgetDetails.totalSpentOverall)}
                    </p>
                </div>
              </div>

              {budgetDetails.categoryAllocations && budgetDetails.categoryAllocations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 pt-3 mt-3 border-t border-gray-200">Category Breakdown</h4>
                  <div className="space-y-3">
                    {budgetDetails.categoryAllocations.map(alloc => (
                      <div key={alloc._id || alloc.category} className="text-xs">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-gray-600 font-medium truncate pr-2" title={alloc.category}>{alloc.category}</span>
                          <span className="text-gray-500 whitespace-nowrap">
                            {formatCurrency(alloc.spent)} / {formatCurrency(alloc.amount)}
                          </span>
                        </div>
                        <ProgressBar value={alloc.spent} max={alloc.amount} colorClass={alloc.remaining < 0 ? 'bg-red-400' : 'bg-green-400'} />
                        <p className={`text-right text-xs mt-0.5 ${alloc.remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {alloc.remaining < 0 ? `Over by ${formatCurrency(Math.abs(alloc.remaining))}` : `${formatCurrency(alloc.remaining)} left`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(!budgetDetails.categoryAllocations || budgetDetails.categoryAllocations.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-2 mt-2">No specific category budgets allocated for this period.</p>
              )}
            </>
          )}
          {!loadingDetails && !budgetDetails && initialBudget?._id && (
            <p className="text-xs text-gray-500 text-center py-2">Could not load details. Click to try again.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetListItem;