import { useState, useEffect } from "react";
import {
  Briefcase,
  Bookmark,
  Menu,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000");
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return encodeURI(`${base}${cleanPath}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16 gap-2">

          {/* Logo */}
          <Link to='/find-jobs' className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <img src={logo} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 object-contain flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white truncate">CareerHub</span>
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
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
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
                  className="text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden sm:inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-900 text-gray-500 dark:text-slate-400 transition"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 transition-colors duration-200">
          <Link
            to="/find-jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium py-1"
          >
            Find Jobs
          </Link>
          <Link
            to="/for-employers"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium py-1"
          >
            For Employers
          </Link>
          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium py-1"
            >
              Admin Panel
            </Link>
          )}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white font-medium py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;