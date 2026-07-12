import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AdminLayout from "../../components/layout/AdminLayout";
import moment from "moment";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchApplications = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.APPLICATIONS);
      setApplications(response.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "in review": return "bg-blue-100 text-blue-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  const filtered = applications.filter((app) => {
    // ✅ FIX: when the search box is empty, always show every application.
    // Previously, applications whose linked Job or User had been deleted
    // (job/applicant populate to null) evaluated to `undefined || undefined`
    // here, which is falsy — silently hiding them even with no search term.
    if (!search.trim()) return true;

    const q = search.toLowerCase();
    return (
      (app.applicant?.fullName?.toLowerCase().includes(q) ?? false) ||
      (app.job?.title?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500 mt-1">View all job applications</p>
          </div>
          <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-xl text-sm font-medium">
            Total: {applications.length}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Job</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No applications found</td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            {app.applicant?.avatar ? (
                              <img
                                src={app.applicant.avatar.startsWith("http") ? app.applicant.avatar : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${app.applicant.avatar}`}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-semibold">
                                {app.applicant?.fullName?.charAt(0).toUpperCase() || "?"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.applicant?.fullName || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{app.applicant?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{app.job?.title || "Unknown Job"}</p>
                        <p className="text-xs text-gray-500">{app.job?.company?.companyName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                          {app.status || "applied"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {moment(app.createdAt).format("DD MMM YYYY")}
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

export default AdminApplications;