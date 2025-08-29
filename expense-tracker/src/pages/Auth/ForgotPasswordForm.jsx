import React, { useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      setMessage("If that account exists, you’ll receive reset instructions.");
    } catch {
      setMessage("Error sending reset email. Please try again later.");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold text-black">Forgot Password</h2>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          We will send you a recovery link to the mail provided below
        </p>
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
         <button
            type="submit"
            className="btn-primary bg-emerald-500 hover:bg-emerald-600"
            >
        Send Reset Link
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
        <p className="text-sm text-center">
          <Link to="/login" className="underline text-primary">Back to Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
