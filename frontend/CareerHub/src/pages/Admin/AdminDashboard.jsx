import { useEffect, useState } from "react";
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AdminLayout from "../../components/layout/AdminLayout";
//import DashboardLayout from "../../components/layout/DashboardLayout";

// ✅ மாற்றவும் — +12% remove
const StatCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
    <p className="text-3xl font-bold text-gray-900 mb-1">{value ?? 0}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.ADMIN.DASHBOARD);
        setDashboard(response.data);
      } catch (err) {
        console.error("Admin dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Users",
      key: "totalUsers",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Employers",
      key: "totalEmployers",
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Jobs",
      key: "totalJobs",
      icon: Briefcase,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Total Applications",
      key: "totalApplications",
      icon: FileText,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor users, jobs, and platform activity.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={loading ? "..." : dashboard?.counts?.[stat.key]}
              icon={stat.icon}
              color={stat.color}
              bg={stat.bg}
            />
          ))}
        </div>

        {/* Recent Users + Recent Jobs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* Recent Users */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Recent Users</h2>
                <p className="text-xs text-gray-500 mt-0.5">Latest signups and role activity</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : (
                dashboard?.recentUsers?.map((user) => (
                  <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                      user.role === "employer"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Recent Jobs</h2>
                <p className="text-xs text-gray-500 mt-0.5">Latest postings from employers</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-400">Loading...</p>
              ) : (
                dashboard?.recentJobs?.map((job) => (
                  <div key={job._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {job.company?.companyName || job.company?.fullName || "Unknown Company"}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      job.isClosed
                        ? "bg-gray-100 text-gray-600"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {job.isClosed ? "Closed" : "Active"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Manage Users", icon: Users, color: "text-blue-600", bg: "bg-blue-50", path: "/admin/users" },
              { label: "Manage Employers", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50", path: "/admin/employers" },
              { label: "Manage Jobs", icon: Briefcase, color: "text-violet-600", bg: "bg-violet-50", path: "/admin/jobs" },
              { label: "View Applications", icon: FileText, color: "text-orange-600", bg: "bg-orange-50", path: "/admin/applications" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => window.location.href = action.path}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-blue-500/20 bg-gray-50/50 hover:bg-white dark:hover:bg-slate-900/50 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-10 h-10 ${action.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center transition-colors">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accepted Applications Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Application Statistics</h2>
              <p className="text-xs text-gray-500 mt-0.5">Overview of application status</p>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Applications", key: "totalApplications", color: "bg-blue-50 text-blue-700" },
              { label: "Accepted", key: "totalAccepted", color: "bg-green-50 text-green-700" },
              { label: "Rejected", key: "totalRejected", color: "bg-red-50 text-red-700" },
              { label: "Pending", key: "totalPending", color: "bg-yellow-50 text-yellow-700" },
            ].map((item) => (
              <div key={item.key} className={`rounded-xl p-4 ${item.color}`}>
                <p className="text-xs font-medium opacity-70">{item.label}</p>
                <p className="text-2xl font-bold mt-2">
                  {loading ? "..." : dashboard?.counts?.[item.key] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;