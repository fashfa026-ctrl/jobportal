import { useEffect, useState } from "react";
import { Trash2, Search, ShieldOff, ShieldCheck } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import AdminLayout from "../../components/layout/AdminLayout";
import toast from "react-hot-toast";
import moment from "moment";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.ADMIN.USERS);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW — Block / Unblock
  const handleToggleBlock = async (id, isBlocked) => {
    const action = isBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await axiosInstance.put(API_PATHS.ADMIN.TOGGLE_BLOCK_USER(id));
      toast.success(`User ${action}ed successfully!`);
      fetchUsers();
    } catch (err) {
      toast.error(`Failed to ${action} user.`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(id));
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all registered users</p>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium">
            Total: {users.length}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
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
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found</td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            {user.avatar ? (
                              <img
                                src={user.avatar.startsWith("http") ? user.avatar : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${user.avatar}`}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-semibold">
                                {user.fullName?.charAt(0).toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === "employer"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      {/* ✅ NEW — Block status column */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {moment(user.createdAt).format("DD MMM YYYY")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* ✅ NEW — Block/Unblock button */}
                          <button
                            onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                            className={`p-2 rounded-lg transition ${
                              user.isBlocked
                                ? "text-gray-400 hover:text-green-600 hover:bg-green-50"
                                : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
                            }`}
                            title={user.isBlocked ? "Unblock User" : "Block User"}
                          >
                            {user.isBlocked
                              ? <ShieldCheck className="w-4 h-4" />
                              : <ShieldOff className="w-4 h-4" />
                            }
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete User"
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

export default AdminUsers;