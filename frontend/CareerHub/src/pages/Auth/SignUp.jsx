import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader,
  Briefcase,
} from "lucide-react";

import { validateEmail, validatePassword } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    showConfirmPassword: false,
    avatarPreview: null,
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: "",
        },
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));

    if (formState.errors.role) {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          role: "",
        },
      }));
    }
  };

  const validateAvatar = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      return "Avatar must be less than 5MB";
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return "Only JPG and PNG files are allowed";
    }

    return null;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const error = validateAvatar(file);

      if (error) {
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            avatar: error,
          },
        }));

        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      const reader = new FileReader();

      reader.onload = (e) => {
        setFormState((prev) => ({
          ...prev,
          avatarPreview: e.target.result,
          errors: {
            ...prev.errors,
            avatar: "",
          },
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      fullName: !formData.fullName ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),

      confirmPassword:
        formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "",

      role: !formData.role ? "Please select a role" : "",
      avatar: "",
    };

    Object.keys(errors).forEach((key) => {
      if (!errors[key]) delete errors[key];
    });

    setFormState((prev) => ({
      ...prev,
      errors,
    }));

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Save token + AuthContext update
      // Backend returns { token, user: {...} } — role lives under response.data.user
      const userData = response.data.user || response.data;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData, response.data.token);

      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
      }));

      // ✅ 1.5s success screen காட்டி redirect
      const role = userData.role;
      setTimeout(() => {
        if (role === "employer") {
          navigate("/employer/dashboard");
        } else if (role === "jobseeker") {
          navigate("/find-jobs");
        } else {
          navigate("/login");
        }
      }, 1500);

    } catch (error) {
      console.log(error);

      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        },
      }));
    }
  };

  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created!
          </h2>

          <p className="text-gray-600 mb-4">
            Welcome to CareerHub! Your account has been successfully created.
          </p>

          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />

          <p className="text-sm text-gray-500 mt-2">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-200">
      
      {/* Left Column: Visual Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-indigo-950 dark:via-purple-950 dark:to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 dark:bg-purple-950/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="flex items-center space-x-3 text-white z-10">
          <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
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
              Join the future of professional hiring.
            </h1>
            {/* [FIXED] dark:text-slate-350 -> dark:text-slate-300 (350 is not a valid Tailwind shade) */}
            <p className="text-lg text-blue-100 dark:text-slate-300 leading-relaxed">
              Create your account in minutes to start applying for jobs or recruiting top-tier global talent.
            </p>
          </motion.div>

          {/* Checklist */}
          <div className="space-y-4">
            {[
              "Build a rich professional profile with resume and photo uploads.",
              "Apply to thousands of verified remote and local job roles.",
              "Direct communication with verified employers and companies.",
              "Completely free for candidates, forever."
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
          © {new Date().getFullYear()} CareerHub. The premium choice for developers.
        </p>
      </div>

      {/* Right Column: Form Container */}
      {/* [FIXED] Added a subtle glow blob (relative + overflow-hidden + 2 blur divs) so the right
          panel doesn't look visually "flatter" than the left panel's rich gradient/glow */}
      <div className="lg:col-span-5 flex items-center justify-center p-4 md:p-8 relative overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-gray-150/80 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6 my-6 relative z-10"
        >
          {/* Brand Badge inside Card (SaaS design) */}
          <div className="flex items-center space-x-2.5 pb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Briefcase className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-wide text-gray-900 dark:text-white">CareerHub</span>
          </div>

          {/* Heading */}
          <div className="text-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h2>
            {/* [FIXED] dark:text-slate-450 -> dark:text-slate-400 */}
            <p className="text-gray-500 dark:text-slate-400 mt-1 text-sm">Join thousands of professionals finding their dream jobs</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Full Name *
              </label>

              <div className="relative">
                {/* [FIXED] dark:text-slate-550 -> dark:text-slate-500 */}
                <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 ${
                    formState.errors.fullName
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-slate-800"
                  }`}
                />
              </div>

              {formState.errors.fullName && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Email Address *
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 ${
                    formState.errors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-slate-800"
                  }`}
                />
              </div>

              {formState.errors.email && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Password *
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />

                <input
                  type={formState.showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 ${
                    formState.errors.password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-slate-800"
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
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {/* [FIXED] Eye/EyeOff were swapped — now "Eye" invites reveal, "EyeOff" invites hide */}
                  {formState.showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formState.errors.password && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Confirm Password *
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />

                <input
                  type={formState.showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 ${
                    formState.errors.confirmPassword
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-slate-800"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({
                      ...prev,
                      showConfirmPassword: !prev.showConfirmPassword,
                    }))
                  }
                  className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  {/* [FIXED] Same Eye/EyeOff swap corrected here too */}
                  {formState.showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {formState.errors.confirmPassword && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Profile Picture (Optional)
              </label>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {formState.avatarPreview ? (
                    <img
                      src={formState.avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400 dark:text-slate-600" />
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    id="avatar"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="avatar"
                    className="cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-slate-300 transition-colors flex items-center space-x-2 w-fit"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </label>

                  {/* [FIXED] dark:text-slate-550 -> dark:text-slate-500 */}
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1.5">
                    JPG, PNG up to 5MB
                  </p>
                </div>
              </div>

              {formState.errors.avatar && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1.5 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.avatar}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                I am a *
              </label>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("jobseeker")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.role === "jobseeker"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="font-bold text-sm text-gray-900 dark:text-white">Job Seeker</div>
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                    Looking for opportunities
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("employer")}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    formData.role === "employer"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  {/* [FIXED] dark:purple-400 -> dark:text-purple-400 (missing "text-" prefix meant this never applied) */}
                  <Building2 className="w-8 h-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                  <div className="font-bold text-sm text-gray-900 dark:text-white">Employer</div>
                  {/* [FIXED] dark:text-slate-550 -> dark:text-slate-500 */}
                  <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                    Hiring talent
                  </div>
                </button>
              </div>

              {formState.errors.role && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {formState.errors.role}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {formState.errors.submit && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-3">
                <p className="text-red-700 dark:text-red-400 text-sm flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {formState.errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formState.loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {formState.loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
