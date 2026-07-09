import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Loader, AlertCircle, ShieldCheck, Briefcase } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // step: "email" -> "otp"
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const inputRefs = useRef([]);

  // ===== STEP 1: Send OTP to email =====
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      toast.success("OTP sent to your email");
      setStep("otp");
      setTimeLeft(5 * 60);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 2: Verify OTP, then move to the reset-password page =====
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the full 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(API_PATHS.AUTH.VERIFY_OTP, { email, otp: otpCode });
      // ✅ Pass email + otp forward via route state so ResetPassword.jsx
      // can call /reset-password without re-asking for the OTP.
      navigate("/reset-password", { state: { email, otp: otpCode } });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });
      toast.success("OTP resent to your email");
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(5 * 60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer — only runs while on the OTP step
  useEffect(() => {
    if (step !== "otp") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

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
        {step === "email" ? (
          <>
            {/* ===== STEP 1: Enter Email ===== */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2">
                Enter your email to receive a 6-digit OTP
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-950 text-gray-900 dark:text-white border-gray-300 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      error ? "border-red-500 dark:border-red-550" : "border-gray-300 dark:border-slate-800"
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-305 text-sm font-semibold">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* ===== STEP 2: Enter OTP ===== */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="w-14 h-14 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enter OTP</h2>
              <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-550 transition-colors duration-200"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error}
                </p>
              )}

              <p className={`text-sm text-center ${timeLeft > 0 ? "text-blue-550 dark:text-blue-400" : "text-red-500 dark:text-red-400 font-semibold"}`}>
                {timeLeft > 0
                  ? `OTP expires in ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`
                  : "⚠️ OTP expired! Please resend."}
              </p>

              <button
                type="submit"
                disabled={loading || timeLeft === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm disabled:opacity-50 cursor-pointer"
                >
                  Didn't receive code? Resend OTP
                </button>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 text-sm font-semibold">
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

export default ForgotPassword;