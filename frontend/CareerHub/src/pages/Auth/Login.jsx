import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  Briefcase,
  CheckCircle,
} from "lucide-react";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
  });

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: "" },
      }));
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });
    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true, errors: {} }));

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      const token = response.data.token;
      const userData = response.data.user || response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData, token);

      setFormState((prev) => ({ ...prev, loading: false }));

      const role = response.data.user?.role || response.data.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "employer") {
        navigate("/employer/dashboard");
      } else if (role === "jobseeker") {
        navigate("/find-jobs");
      } else {
        navigate("/");
      }
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit: error.response?.data?.message || "Invalid email or password",
        },
      }));
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* Left Column: Visual Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="flex items-center space-x-3 text-white z-10">
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
          <span className="text-xl font-bold tracking-wide">CareerHub</span>
        </div>

        {/* Center content */}
        <div className="my-auto max-w-lg z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-4 text-white"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Discover opportunities that matter.
            </h1>
            {/* [FIXED] dark:text-slate-350 -> dark:text-slate-300 (invalid shade) */}
            <p className="text-lg text-blue-100 dark:text-slate-300 leading-relaxed">
              Log in to your personalized job portal to view active vacancies, track applications, and communicate with recruiters.
            </p>
          </motion.div>

          {/* [FIXED - Option A] Removed the fake "Jerald P." testimonial (fabricated name +
              quote pretending to be a real user). Replaced with a genuine feature checklist,
              matching the same honest, no-fake-social-proof style used on the SignUp page. */}
          <div className="space-y-4">
            {[
              "Track every application's status in real time.",
              "Get notified the moment an employer responds.",
              "One dashboard for every job you've applied to.",
            ].map((text, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                key={i}
                className="flex items-center space-x-3 text-blue-100 dark:text-slate-300 text-sm font-medium"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-blue-200/60 dark:text-slate-500 z-10">
          © {new Date().getFullYear()} CareerHub. Connecting talent worldwide.
        </p>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:col-span-5 flex items-center justify-center p-4 md:p-8 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-150/80 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6"
        >
          {/* Brand Badge inside Card (SaaS design) */}
          <div className="flex items-center space-x-2.5 pb-2">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-extrabold text-sm tracking-wide text-gray-900 dark:text-white">CareerHub</span>
          </div>

          {/* Heading */}
          <div className="text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
            {/* [FIXED] dark:text-slate-450 -> dark:text-slate-400 (invalid shade) */}
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">Please enter your credentials to login</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                {/* [FIXED] dark:text-slate-550 -> dark:text-slate-500 */}
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 ${
                    formState.errors.email ? "border-red-500 dark:border-red-500" : "border-gray-200 dark:border-slate-800"
                  }`}
                />
              </div>
              {formState.errors.email && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Password
                </label>
                {/* ✅ Forgot Password Link */}
                <Link
                  to="/forgot-password"
                  state={{ email: formData.email }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type={formState.showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 ${
                    formState.errors.password ? "border-red-500 dark:border-red-500" : "border-gray-200 dark:border-slate-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      showPassword: !prev.showPassword,
                    }))
                  }
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {/* [FIXED] Eye/EyeOff were swapped — same fix applied as SignUp.jsx */}
                  {formState.showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formState.errors.password && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.password}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {formState.errors.submit && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {formState.errors.submit}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={formState.loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-500/10 cursor-pointer"
            >
              {formState.loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Signup */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  Create one here
                </Link>
              </p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
