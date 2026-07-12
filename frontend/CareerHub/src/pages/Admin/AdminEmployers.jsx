import { useEffect, useState } from "react";
import { Search, Building2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AdminLayout from "../../components/layout/AdminLayout";
import moment from "moment";

const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEmployers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.USERS);
      const employerList = response.data.filter((u) => u.role === "employer");
      setEmployers(employerList);
    } catch (err) {
      console.error("Error fetching employers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const filtered = employers.filter(
    (e) =>
      e.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all registered employers</p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-medium">
            Total: {employers.length}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employers..."
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Employer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">No employers found</td>
                  </tr>
                ) : (
                  filtered.map((employer) => (
                    <tr key={employer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                            {employer.avatar ? (
                              <img
                                src={employer.avatar.startsWith("http") ? employer.avatar : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${employer.avatar}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                                <span className="text-emerald-700 text-sm font-semibold">
                                  {employer.fullName?.charAt(0).toUpperCase() || "E"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{employer.fullName}</p>
                            <p className="text-xs text-gray-500">{employer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {employer.companyLogo ? (
                            // ✅ மாற்றவும்
  <img
    src={employer.companyLogo.startsWith("http") ? employer.companyLogo : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${employer.companyLogo}`}
    className="w-8 h-8 rounded-lg object-cover border border-gray-200"
  />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                          )}
                          <span className="text-gray-700">{employer.companyName || "No company name"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {moment(employer.createdAt).format("DD MMM YYYY")}
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

export default AdminEmployers;