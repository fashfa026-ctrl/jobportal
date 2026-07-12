import { useEffect, useState } from "react";
import { Trash2, Search, Briefcase, ToggleLeft, ToggleRight } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import moment from "moment";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.JOBS);
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_JOB(id));
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job.");
    }
  };

  const handleToggle = async (id) => {
  try {
    await axiosInstance.put(API_PATHS.ADMIN.TOGGLE_JOB(id)); // ✅ Change this
    toast.success("Job status updated!");
    fetchJobs();
  } catch (err) {
    toast.error("Failed to update job status.");
  }
};

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and manage all job postings</p>
          </div>
          <div className="bg-violet-50 text-violet-700 px-4 py-2 rounded-xl text-sm font-medium">
            Total: {jobs.length}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Job</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Posted</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No jobs found</td>
                  </tr>
                ) : (
                  filtered.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          
  <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
    {job.company?.companyLogo ? (
      <img
        src={
          job.company.companyLogo.startsWith("http")
            ? job.company.companyLogo
            : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${job.company.companyLogo}`
        }
        alt="logo"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-violet-100 flex items-center justify-center">
        <Briefcase className="w-4 h-4 text-violet-600" />
      </div>
    )}
  </div>
                          <div>
                            <p className="font-medium text-gray-900">{job.title}</p>
                            <p className="text-xs text-gray-500">{job.type} · {job.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {job.company?.companyName || "Unknown"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          job.isClosed
                            ? "bg-gray-100 text-gray-600"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {job.isClosed ? "Closed" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {moment(job.createdAt).format("DD MMM YYYY")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(job._id)}
                            className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                            title={job.isClosed ? "Reopen Job" : "Close Job"}
                          >
                            {job.isClosed ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

export default AdminJobs;