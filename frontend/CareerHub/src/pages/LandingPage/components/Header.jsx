import React from "react";
import { Briefcase } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import ThemeToggle from "../../../components/layout/ThemeToggle";

const Header = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 💡 பேக்-எண்ட் படங்களின் பாதையைச் சீரமைக்கும் ஃபங்க்ஷன் (ஹெடரிலும் இது கட்டாயம் இருக்க வேண்டும்)
  const getUrl = (url) => {
    if (!url) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    return `http://localhost:8000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CareerHub</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              onClick={() => navigate("/find-jobs")}
              className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
            >
              Find Jobs
            </a>
            <a
              onClick={() =>
                navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer-dashboard"
                    : "/login"
                )
              }
              className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
            >
              For Employers
            </a>
            {isAuthenticated && user?.role === "admin" && (
              <a
                onClick={() => navigate("/admin/dashboard")}
                className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium cursor-pointer"
              >
                Admin Panel
              </a>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                
                {/* 👤 அவதார் இமேஜ் பிளாக் (இப்போது getUrl மூலமாகச் சுத்திகரிக்கப்பட்டுள்ளது) */}
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-slate-900 p-1 pr-3 rounded-full border border-gray-100 dark:border-slate-800">
                  <img
                    src={getUrl(user?.avatar)} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                  <span className="text-gray-700 dark:text-slate-300 text-sm font-medium hidden sm:inline">
                    {user?.fullName || "Employer"}
                  </span>
                </div>

                <Link
                  to={
                    user?.role === "employer"
                      ? "/employer-dashboard"
                      : user?.role === "admin"
                      ? "/admin/dashboard"
                      : "/find-jobs"
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2">
                  Login
                </Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </motion.header>
  );
};

export default Header;