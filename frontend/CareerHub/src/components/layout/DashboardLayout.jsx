import { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { NAVIGATION_MENU } from "../../pages/utils/data";
import ThemeToggle from "./ThemeToggle";
import logo from "../../assets/logo.png";

// Navigation Item Component
const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item)}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm"
          : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <Icon
        className={`h-5 w-5 flex-shrink-0 ${
          isActive ? "text-blue-600" : "text-gray-500"
        }`}
      />

      {!isCollapsed && (
        <span className="ml-3 truncate">
          {item.label}
        </span>
      )}
    </button>
  );
};

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(
    activeMenu || "employer-dashboard"
  );

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getAvatarUrl = (url) => {
    if (!url || typeof url !== "string")
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000");
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return encodeURI(`${base}${cleanPath}`);
  };

  // Responsive Layout Calculations
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Navigation Handler
  const handleNavigation = (item) => {
    setActiveNavItem(item.id);
    navigate(item.path);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Sidebar toggle behavior
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 transform
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${sidebarCollapsed ? "w-16" : "w-64"}
        bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <Link
              to="/"
              className="flex items-center space-x-3 px-2"
            >
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
              <span className="text-xl font-bold text-gray-900 dark:text-white truncate">
                CareerHub
              </span>
            </Link>
          ) : (
            <div className="w-full flex justify-center">
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Links Navigation */}
        <nav className="p-3 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        {/* Bottom Logout Button */}
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="ml-3 truncate">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Page Layout Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300
        ${isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Header Section */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0">
          
          <div className="flex items-center space-x-4">
            {/* Menu Open/Collapse Trigger */}
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-black focus:outline-none"
            >
              {isMobile && sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Application Branding Text */}
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">
                Welcome back!
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 hidden sm:block">
                Here's what's happening with your jobs today.
              </p>
            </div>
          </div>

          {/* User Profile Action Dropdown */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                className="flex items-center space-x-3 focus:outline-none"
              >
                {user?.profileImage || user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.profileImage || user.avatar)}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                    {user?.name || "Employer"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 max-w-[150px] truncate">
                    {user?.email}
                  </p>
                </div>
              </button>

              {/* Profile Dropdown Items Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
                    <p className="text-xs text-gray-500 dark:text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-150 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Children Content Injection */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950 p-6">
          {children}
        </main>
      </div>

      {/* Dimmed Background Mobile Overlay Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;