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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

// ✅ மாற்றவும் — Employers remove
const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", path: "/admin/users", icon: Users },
    { id: "employers", label: "Employers", path: "/admin/employers", icon: Building2 },
  { id: "jobs", label: "Jobs", path: "/admin/jobs", icon: Briefcase },
  { id: "applications", label: "Applications", path: "/admin/applications", icon: FileText },
];

const AdminLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const activePath = location.pathname;

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white flex">

      {/* Sidebar */}
      <aside className={`bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"} min-h-screen fixed left-0 top-0 z-40`}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
  <Briefcase className="h-5 w-5 text-white" />
</div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">JobPortal</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">Admin Panel</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 transition"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePath === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-blue-600" : "text-gray-500"}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 space-y-3">
          {sidebarOpen && (
            <div className="bg-gray-50 dark:bg-slate-800/40 rounded-xl p-3 mb-2">
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">Signed in as</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user?.role}</p>
            </div>
          )}
          
          <div className={`flex ${sidebarOpen ? "justify-start px-1" : "justify-center"}`}>
            <ThemeToggle />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"} p-8`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;