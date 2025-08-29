import React from "react";
import moment from "moment";
import { LuRepeat, LuTrash2 } from "react-icons/lu";
import { useCurrency } from "../../hooks/useCurrency"; // Make sure this path is correct

// Component for rendering a single subscription item in a simpler row format
const SimpleSubscriptionItem = ({ subscription, onDelete }) => {
  const { formatCurrency } = useCurrency(); // Hook to format currency

  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50 transition-colors duration-150">
      <div className="flex items-center gap-3 flex-1 min-w-0"> {/* Added flex-1 and min-w-0 for better truncation */}
        <div className="p-2 bg-gray-100 rounded-full"> {/* Icon background */}
          <LuRepeat className="text-primary text-lg" />
        </div>
        <div className="flex-1 min-w-0"> {/* Added flex-1 and min-w-0 here too */}
          <p className="font-medium text-sm text-gray-800 truncate" title={subscription.name}>
            {subscription.name}
          </p>
          <p className="text-xs text-gray-500">
            Next Billing: {moment(subscription.nextBillingDate).format("Do MMM YYYY")}
          </p>
          {subscription.category && (
            <p className="text-xs text-gray-400">
              Category: {subscription.category}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-2"> {/* Added ml-2 for spacing */}
        <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          {formatCurrency(subscription.amount)}
        </p>
        <button
          onClick={() => onDelete(subscription._id)}
          className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100 transition-colors duration-150"
          title="Delete Subscription"
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const SubscriptionList = ({ subscriptions, onDelete }) => {
  if (!subscriptions || subscriptions.length === 0) {
    // This case should ideally be handled by the parent component (Subscriptions.jsx)
    // which shows a "No subscriptions found" message.
    // However, as a fallback, you could return null or a minimal message here.
    return null;
  }

  return (
    // The parent div in Subscriptions.jsx should have the "card" class.
    // This component now just renders a list of SimpleSubscriptionItem.
    // No "grid" or "gap" needed here if items are full-width rows.
    <div>
      {subscriptions.map((sub) => (
        <SimpleSubscriptionItem
          key={sub._id}
          subscription={sub}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SubscriptionList;