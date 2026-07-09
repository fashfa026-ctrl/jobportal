import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Shield,
  Building2,
  Menu,
  X,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import logo from "../../assets/logo.png";

// ✅ Nav Items
const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", path: "/admin/users", icon: Users },
  { id: "employers", label: "Employers", path: "/admin/employers", icon: Building2 },
  { id: "jobs", label: "Jobs", path: "/admin/jobs", icon: Briefcase },
  { id: "applications", label: "Applications", path: "/admin/applications", icon: FileText },
  { id: "reports", label: "Reported Jobs", path: "/admin/reports", icon: AlertTriangle },
  { id: "feedback", label: "Feedback", path: "/admin/feedback", icon: Mail },
];

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
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

  const activePath = location.pathname;

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white flex overflow-hidden">

      {/* Sidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-all duration-300 transform
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        w-64 fixed inset-y-0 left-0 z-50`}
      >

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">CareerHub</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Admin Panel</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Info & Theme Toggle */}
        <div className="px-3 pb-4 space-y-3">
          <div className="bg-gray-50 dark:bg-slate-850 rounded-xl p-3 mb-2">
            <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">Signed in as</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user?.role}</p>
          </div>
          
          <div className="flex justify-start px-1">
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isMobile ? "ml-0" : "ml-64"}`}>
        {/* Mobile Header (Only visible below lg breakpoint) */}
        {isMobile && (
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-150 dark:hover:bg-slate-800"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-gray-900 dark:text-white">CareerHub</span>
              </div>
            </div>
          </header>
        )}

        {/* Dynamic Children Content Injection */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50 dark:bg-slate-950">
          {children}
        </main>
      </div>

      {/* Dimmed Background Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;