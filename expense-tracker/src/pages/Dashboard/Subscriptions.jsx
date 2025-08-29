import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AddSubscriptionForm from "../../components/Subscription/AddSubscriptionForm";
import SubscriptionList from "../../components/Subscription/SubscriptionList";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import toast from "react-hot-toast";
import { LuPlus, LuLoader, LuRepeat } from "react-icons/lu";

const Subscriptions = () => {
  useUserAuth();

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDel, setOpenDel] = useState({ show: false, id: null });

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_ALL);
      setSubs(res.data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error(error.response?.data?.message || "Failed to fetch subscriptions.");
      setSubs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubs();
  }, [fetchSubs]);

  const handleAdd = async (newSub) => {
    try {
      await toast.promise(
        axiosInstance.post(API_PATHS.SUBSCRIPTIONS.ADD, newSub),
        {
          loading: "Adding subscription...",
          success: (response) => {
            fetchSubs();
            setOpenAdd(false);
            return response.data?.message || "Subscription added successfully!";
          },
          error: (err) =>
            err.response?.data?.message || "Failed to add subscription.",
        }
      );
    } catch (error) {
      console.error("Error in handleAdd:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await toast.promise(
        axiosInstance.delete(API_PATHS.SUBSCRIPTIONS.DELETE(id)),
        {
          loading: "Deleting subscription...",
          success: () => {
            fetchSubs();
            setOpenDel({ show: false, id: null });
            return "Subscription deleted successfully!";
          },
          error: (err) =>
            err.response?.data?.message || "Failed to delete subscription.",
        }
      );
    } catch (error) {
      console.error("Error in handleDelete:", error);
    }
  };

  return (
    <DashboardLayout activeMenu="Subscriptions">
      <div className="my-5 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">My Subscriptions</h1>
          <button
            className="add-btn add-btn-fill w-full sm:w-auto"
            onClick={() => setOpenAdd(true)}
          >
            <LuPlus className="text-lg" /> Add Subscription
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <LuLoader className="animate-spin text-4xl text-primary" />
            <p className="ml-2 text-gray-600">Loading subscriptions...</p>
          </div>
        )}

        {!loading && subs.length === 0 && (
          <div className="text-center py-10 card">
            <LuRepeat className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No subscriptions found.</p>
            <p className="text-gray-400 mt-2">
              Click "Add Subscription" to get started!
            </p>
          </div>
        )}

        {!loading && subs.length > 0 && (
          // This is the key change: wrapping SubscriptionList in a div with "card" class
          <div className="card p-0"> {/* Added p-0 assuming SimpleSubscriptionItem handles its own padding */}
            <SubscriptionList
              subscriptions={subs}
              onDelete={(id) => setOpenDel({ show: true, id })}
            />
          </div>
        )}

        <Modal
          isOpen={openAdd}
          onClose={() => setOpenAdd(false)}
          title="Add New Subscription"
        >
          <AddSubscriptionForm onAdd={handleAdd} onCancel={() => setOpenAdd(false)} />
        </Modal>

        <Modal
          isOpen={openDel.show}
          onClose={() => setOpenDel({ show: false, id: null })}
          title="Confirm Deletion"
          size="sm"
        >
          <DeleteAlert
            content="Are you sure you want to delete this subscription? This action cannot be undone."
            onDelete={() => handleDelete(openDel.id)}
            onCancel={() => setOpenDel({ show: false, id: null })}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;