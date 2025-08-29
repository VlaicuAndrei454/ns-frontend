import React, { useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { token, password });
      navigate("/login", { state: { resetSuccess: true } });
    } catch {
      setMessage("Invalid or expired token");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-semibold">Reset Password</h2>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please provide your new password below
        </p>
        <Input
          label="New Password"
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
         <button
            type="submit"
            className="btn-primary bg-emerald-500 hover:bg-emerald-600"
        >
            Reset Password
        </button>
        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordForm;
