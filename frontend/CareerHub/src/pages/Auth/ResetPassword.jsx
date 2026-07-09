import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle, Briefcase } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import logo from "../../assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ email + otp arrive via route state from ForgotPassword.jsx (Step 2)
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ✅ Guard: if someone lands here directly without going through the OTP step,
  // send them back to start the flow properly instead of letting them submit
  // a request that will always fail with "Invalid or expired OTP".
  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, {
        email,
        otp,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-gray-150/80 dark:border-slate-800/80 p-8 transition-colors duration-200 space-y-6"
      >
        {/* Brand Badge inside Card (SaaS design) */}
        <div className="flex items-center space-x-2.5 pb-2">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-sm tracking-wide text-gray-900 dark:text-white">CareerHub</span>
        </div>
        {success ? (
          // ✅ Success State
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Reset!
            </h2>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              Your password has been reset successfully. Redirecting to login...
            </p>
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Enter your new password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Enter new password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-950 text-gray-900 dark:text-white border-gray-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      error ? "border-red-500 dark:border-red-550" : "border-gray-300 dark:border-slate-800"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-350 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-550 w-5 h-5" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    placeholder="Confirm new password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-950 text-gray-900 dark:text-white border-gray-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      error ? "border-red-500 dark:border-red-550" : "border-gray-300 dark:border-slate-800"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-350 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 text-sm font-semibold"
                >
                  ← Back to Login
                </Link>
              </div>

            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;