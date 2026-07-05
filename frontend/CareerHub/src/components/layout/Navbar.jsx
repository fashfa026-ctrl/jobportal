import { useState, useEffect } from "react";
import {
  Briefcase,
  Bookmark,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  const getAvatarUrl = (url) => {
    if (!url || typeof url !== "string")
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    const base = "http://localhost:8000";
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return encodeURI(`${base}${cleanPath}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to='/find-jobs' className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">CareerHub</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/find-jobs" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
              Find Jobs
            </Link>
            <Link to="/for-employers" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
              For Employers
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin/dashboard" className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
                Admin Panel
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user && (
              <button
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-900 text-gray-500 dark:text-slate-400 transition-colors duration-200 relative cursor-pointer"
                onClick={() => navigate("/saved-jobs")}
              >
                <Bookmark className="h-5 w-5" />
              </button>
            )}

            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  if (e && e.stopPropagation) e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={getAvatarUrl(user?.avatar)}
                companyName={user?.fullName || user?.companyName || user?.email?.split('@')[0] || "User"}
                email={user?.email || ""}
                userRole={user?.role || "candidate"}
                onLogout={logout}
              />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;