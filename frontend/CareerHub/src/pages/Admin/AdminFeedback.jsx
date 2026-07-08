import { useEffect, useState } from "react";
import { Search, Mail, Check, Inbox } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import moment from "moment";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFeedbacks = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/feedback");
      setFeedbacks(response.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      toast.error("Failed to fetch feedback messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/api/admin/feedback/${id}`, { status });
      toast.success(`Message marked as ${status}!`);
      fetchFeedbacks();
    } catch (err) {
      toast.error("Failed to update message status.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filtered = feedbacks.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback & Contacts</h1>
            <p className="text-sm text-gray-500 mt-1">Read and manage inquiries submitted via the contact form</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Total Messages: {feedbacks.length}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or message content..."
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
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No messages found</td>
                  </tr>
                ) : (
                  filtered.map((fb) => (
                    <tr key={fb._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{fb.name}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{fb.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-slate-350 max-w-md whitespace-pre-line">
                        {fb.message}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {moment(fb.createdAt).format("DD MMM YYYY, hh:mm A")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          fb.status === "new"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                        }`}>
                          {fb.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {fb.status === "new" ? (
                          <button
                            onClick={() => handleUpdateStatus(fb._id, "read")}
                            className="p-1.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
                            title="Mark as Read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Inbox className="w-3.5 h-3.5" /> Read
                          </span>
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

export default AdminFeedback;
