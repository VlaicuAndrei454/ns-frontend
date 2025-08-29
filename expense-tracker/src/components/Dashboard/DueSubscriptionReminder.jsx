import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useCurrency } from "../../hooks/useCurrency";

const DueSubscriptionReminder = () => {
  const { formatCurrency } = useCurrency();
  const [due, setDue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 1. Fetch subscriptions and filter those due today
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SUBSCRIPTIONS.GET_ALL);
        const today = new Date().toISOString().slice(0, 10);
        const dueToday = res.data.filter(
          (s) => s.nextBillingDate.slice(0, 10) === today
        );
        if (dueToday.length) {
          setDue(dueToday);
          setShowModal(true);
        }
      } catch (err) {
        console.error("Error loading subscriptions:", err);
      }
    })();
  }, []);

  // 2. Mark one subscription as paid
  const handlePay = async (sub) => {
    setLoading(true);
    try {
      // Call backend to create an expense + roll forward nextBillingDate
      await axiosInstance.post(API_PATHS.SUBSCRIPTIONS.PAY(sub._id));
      toast.success(`Marked ${sub.name} as paid.`);
      // Remove from list
      setDue((d) => d.filter((x) => x._id !== sub._id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark paid.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title="Subscriptions Due Today"
    >
      <div className="space-y-4">
        {due.map((sub) => (
          <div
            key={sub._id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded"
          >
            <div>
              <p className="font-medium">{sub.name}</p>
              <p className="text-sm text-gray-600">
                {formatCurrency(sub.amount)}
              </p>
            </div>
            <button
              className="add-btn add-btn-fill"
              onClick={() => handlePay(sub)}
              disabled={loading}
            >
              {loading ? "..." : "I Paid"}
            </button>
          </div>
        ))}
        {due.length === 0 && (
          <p className="text-center text-gray-600">No more due today.</p>
        )}
      </div>
    </Modal>
  );
};

export default DueSubscriptionReminder;
