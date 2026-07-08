import { useEffect, useState } from "react";
import { Search, AlertTriangle, ShieldCheck, ShieldAlert, Check, X } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import moment from "moment";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/reports");
      setReports(response.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
      toast.error("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/api/admin/reports/${id}`, { status });
      toast.success(`Report marked as ${status}!`);
      fetchReports();
    } catch (err) {
      toast.error("Failed to update report status.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.job?.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.reason?.toLowerCase().includes(search.toLowerCase()) ||
      r.reportedBy?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reported Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage job listings reported by users</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Total Reports: {reports.length}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports by job title, reporter, or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-800 rounded-xl text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported By</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No reports found</td>
                  </tr>
                ) : (
                  filtered.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {report.job?.title || <span className="text-red-500 italic">Deleted Job</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                        {report.reportedBy ? (
                          <div>
                            <p className="font-medium text-gray-800 dark:text-slate-200">{report.reportedBy.fullName}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500">{report.reportedBy.email}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Guest User</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-300 max-w-xs truncate" title={report.reason}>
                        {report.reason || <span className="text-gray-400 italic">No reason provided</span>}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {moment(report.createdAt).format("DD MMM YYYY, hh:mm A")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          report.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                            : report.status === "reviewed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {report.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(report._id, "reviewed")}
                              className="p-1.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                              title="Mark Reviewed"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(report._id, "dismissed")}
                              className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
                              title="Dismiss Report"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
