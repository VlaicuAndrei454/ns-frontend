import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import BudgetForm from '../../components/Budgets/BudgetForm';
import BudgetListItem from '../../components/Budgets/BudgetListItem';
import { LuPlus, LuLoader } from 'react-icons/lu'; // Corrected: LuLoader2 to LuLoader
import DeleteAlert from '../../components/DeleteAlert';

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null); // For editing
  const [showDeleteAlert, setShowDeleteAlert] = useState({ show: false, id: null });

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.BUDGETS.GET_ALL);
      setBudgets(response.data || []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error(error.response?.data?.message || "Failed to fetch budgets.");
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, []); // API_PATHS.BUDGETS.GET_ALL is stable, so empty array is fine or add it if ESLint complains

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleOpenModal = (budget = null) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleSaveBudget = async (budgetData) => {
    const promise = editingBudget
      ? axiosInstance.put(API_PATHS.BUDGETS.UPDATE(editingBudget._id), budgetData)
      : axiosInstance.post(API_PATHS.BUDGETS.ADD, budgetData);

    try {
      await toast.promise(promise, {
        loading: editingBudget ? 'Updating budget...' : 'Adding budget...',
        success: (response) => {
          fetchBudgets(); // Refresh list
          handleCloseModal();
          return response.data?.message || `Budget ${editingBudget ? 'updated' : 'added'} successfully!`;
        },
        error: (err) => err.response?.data?.message || `Failed to ${editingBudget ? 'update' : 'add'} budget.`,
      });
    } catch (error) {
      // Toast promise handles individual errors, this catch is for unexpected issues
      console.error("Error saving budget:", error);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!id) return;
    try {
      await toast.promise(axiosInstance.delete(API_PATHS.BUDGETS.DELETE(id)), {
        loading: 'Deleting budget...',
        success: () => {
          fetchBudgets(); // Refresh list
          setShowDeleteAlert({ show: false, id: null });
          return 'Budget deleted successfully!';
        },
        error: (err) => err.response?.data?.message || 'Failed to delete budget.',
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const openDeleteConfirmation = (id) => {
    setShowDeleteAlert({ show: true, id });
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteAlert({ show: false, id: null });
  };


  return (
    <DashboardLayout activeMenu="Budgets">
      <div className="my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Added container for better layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"> {/* Responsive flex */}
          <h1 className="text-2xl font-semibold text-gray-800">My Budgets</h1>
          <button
            onClick={() => handleOpenModal()}
            className="add-btn add-btn-fill w-full sm:w-auto" // Responsive width
          >
            <LuPlus className="text-lg" /> Create New Budget
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <LuLoader className="animate-spin text-4xl text-primary" /> {/* Corrected: LuLoader2 to LuLoader */}
            <p className="ml-2 text-gray-600">Loading budgets...</p>
          </div>
        )}

        {!loading && budgets.length === 0 && (
          <div className="text-center py-10 card">
            <p className="text-gray-500 text-lg">No budgets set up yet.</p>
            <p className="text-gray-400 mt-2">Click "Create New Budget" to get started!</p>
          </div>
        )}

        {!loading && budgets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetListItem
                key={budget._id}
                budget={budget}
                onEdit={() => handleOpenModal(budget)}
                onDelete={() => openDeleteConfirmation(budget._id)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingBudget ? 'Edit Budget Period' : 'Create New Budget Period'}
        >
          <BudgetForm
            onSubmit={handleSaveBudget}
            onCancel={handleCloseModal}
            initialData={editingBudget}
          />
        </Modal>
      )}

      {showDeleteAlert.show && (
        <Modal
          isOpen={showDeleteAlert.show}
          onClose={closeDeleteConfirmation}
          title="Confirm Deletion"
          size="sm" // Smaller modal for alerts
        >
          <DeleteAlert
            content="Are you sure you want to delete this budget period and all its category allocations? This action cannot be undone."
            onDelete={() => handleDeleteBudget(showDeleteAlert.id)}
            onCancel={closeDeleteConfirmation}
          />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default BudgetPage;