import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useCurrency } from '../../hooks/useCurrency';
import { LuArrowRight, LuPiggyBank, LuTarget, LuActivity, LuDollarSign, LuListChecks, LuLoader } from 'react-icons/lu';
import toast from 'react-hot-toast';

const ProgressBar = ({ value, max, colorClass = 'bg-primary' }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const displayPercentage = Math.max(0, percentage);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
      <div
        className={`${colorClass} h-2 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${displayPercentage}%` }}
      ></div>
    </div>
  );
};

const BudgetOverview = () => {
  const navigate = useNavigate();
  const { formatCurrency } = useCurrency();
  const [activeBudgetDetails, setActiveBudgetDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndProcessBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActiveBudgetDetails(null);

    try {
      const allBudgetsResponse = await axiosInstance.get(API_PATHS.BUDGETS.GET_ALL);
      const allBudgets = allBudgetsResponse.data || [];

      if (allBudgets.length === 0) {
        setLoading(false);
        return; // No budgets set up at all
      }

      const today = new Date();
      today.setHours(0,0,0,0); // Normalize today to start of day for comparison

      const currentActiveBudget = allBudgets.find(b => {
        const startDate = new Date(b.startDate);
        startDate.setHours(0,0,0,0);
        const endDate = new Date(b.endDate);
        endDate.setHours(23,59,59,999); // Ensure endDate covers the whole day
        return startDate <= today && endDate >= today;
      });

      if (currentActiveBudget) {
        // Fetch details for this active budget
        try {
          const detailsResponse = await axiosInstance.get(API_PATHS.BUDGETS.GET_ONE(currentActiveBudget._id));
          setActiveBudgetDetails(detailsResponse.data);
        } catch (detailError) {
          console.error("Error fetching active budget details:", detailError);
          setError("Could not load details for the active budget.");
          // Optionally, still show the currentActiveBudget basic info if details fail
          // setActiveBudgetDetails(currentActiveBudget); // Fallback to basic info
        }
      }
    } catch (err) {
      console.error("Error fetching budgets for overview:", err);
      setError(err.response?.data?.message || "Failed to load budget overview.");
    } finally {
      setLoading(false);
    }
  }, []); // API_PATHS are stable

  useEffect(() => {
    fetchAndProcessBudgets();
  }, [fetchAndProcessBudgets]);

  const overallRemaining = activeBudgetDetails ? activeBudgetDetails.overallAmount - activeBudgetDetails.totalSpentOverall : 0;

  return (
    <div className="card h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-lg font-semibold text-gray-700">Budget Overview</h5>
        <button
          onClick={() => navigate('/budgets')}
          className="card-btn"
        >
          Manage Budgets <LuArrowRight className="text-base" />
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
          <LuLoader className="text-3xl text-primary animate-spin mb-2" />
          <p className="text-sm text-gray-500">Loading budget overview...</p>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
          <LuPiggyBank className="text-4xl text-red-400 mb-3" />
          <p className="text-gray-600 mb-1 text-sm font-medium">Error loading budget data</p>
          <p className="text-xs text-gray-400">{error}</p>
          <button onClick={fetchAndProcessBudgets} className="btn-secondary mt-3 text-xs">Try Again</button>
        </div>
      )}

      {!loading && !error && !activeBudgetDetails && (
        <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
          <LuPiggyBank className="text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 mb-1">No active budget for the current period.</p>
          <p className="text-sm text-gray-400">Set up or check your budget periods.</p>
        </div>
      )}

      {!loading && !error && activeBudgetDetails && (
        <div className="space-y-3 mt-2 flex-grow">
          <div>
            <div className="flex justify-between items-baseline mb-1">
                <h6 className="text-sm font-medium text-gray-700 truncate" title={activeBudgetDetails.name}>
                    {activeBudgetDetails.name}
                </h6>
                <span className="text-xs text-gray-500">
                    {new Date(activeBudgetDetails.startDate).toLocaleDateString('en-CA')} - {new Date(activeBudgetDetails.endDate).toLocaleDateString('en-CA')}
                </span>
            </div>
            <div className="flex justify-between items-center text-xs mb-0.5">
              <span className="text-gray-600">
                <LuTarget className="inline mr-1 text-xs text-blue-500" />
                Overall: {formatCurrency(activeBudgetDetails.totalSpentOverall)} / {formatCurrency(activeBudgetDetails.overallAmount)}
              </span>
              <span className={`font-medium ${overallRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {overallRemaining < 0 ? `Over by ${formatCurrency(Math.abs(overallRemaining))}` : `${formatCurrency(overallRemaining)} Left`}
              </span>
            </div>
            <ProgressBar value={activeBudgetDetails.totalSpentOverall} max={activeBudgetDetails.overallAmount} />
          </div>

          {activeBudgetDetails.categoryAllocations && activeBudgetDetails.categoryAllocations.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <h6 className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center">
                <LuListChecks className="mr-1.5 text-primary" /> Category Breakdown (Top 3)
              </h6>
              <div className="space-y-1.5">
                {activeBudgetDetails.categoryAllocations.slice(0, 3).map(alloc => (
                  <div key={alloc._id || alloc.category} className="text-xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-gray-600 font-medium truncate pr-1" title={alloc.category}>{alloc.category}</span>
                      <span className="text-gray-500 whitespace-nowrap">
                        {formatCurrency(alloc.spent)} / {formatCurrency(alloc.amount)}
                      </span>
                    </div>
                    <ProgressBar value={alloc.spent} max={alloc.amount} colorClass={alloc.remaining < 0 ? 'bg-red-400' : (alloc.spent / alloc.amount > 0.8 ? 'bg-yellow-400' : 'bg-green-400')} />
                  </div>
                ))}
              </div>
            </div>
          )}
           {activeBudgetDetails.categoryAllocations && activeBudgetDetails.categoryAllocations.length === 0 && (
             <p className="text-xs text-gray-400 text-center pt-2">No specific category budgets for this period.</p>
           )}
        </div>
      )}
    </div>
  );
};

export default BudgetOverview;