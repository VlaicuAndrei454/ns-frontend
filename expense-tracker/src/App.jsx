import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import UserProvider from "./context/UserContext";

import LoginForm from "./pages/Auth/LoginForm";
import SignUpForm from "./pages/Auth/SignUpForm";
import ForgotPasswordForm from "./pages/Auth/ForgotPasswordForm";
import ResetPasswordForm from "./pages/Auth/ResetPasswordForm";

import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import CryptoDashboard from "./pages/Dashboard/Crypto";
import Subscriptions from "./pages/Dashboard/Subscriptions";
import StocksDashboard from "./pages/Dashboard/Stocks";
import BudgetPage from "./pages/Dashboard/BudgetPage"; // Corrected import path

// Redirect helper
const Root = () => {
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Or use your context/auth state
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Root />} />

          {/* Auth routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordForm />}
          />

          {/* Dashboard and sub‐pages */}
          {/* These routes will typically render components within your DashboardLayout */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/stocks" element={<StocksDashboard />} />
          <Route path="/crypto" element={<CryptoDashboard />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/budgets" element={<BudgetPage />} /> {/* Budget page route */}
          
          {/* Add other application routes here if any */}
          {/* Example:
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          */}

          {/* Fallback for unmatched routes - optional */}
          {/* <Route path="*" element={<Navigate to="/" />} /> */}
        </Routes>
      </Router>

      <Toaster
        position="top-right" // Optional: configure toaster position
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: "14px", // Consistent font size
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
           error: {
            duration: 4000,
             style: {
              background: '#FF3333', // Example: red background for errors
              color: '#fff',
            },
          },
        }}
      />
    </UserProvider>
  );
};

export default App;