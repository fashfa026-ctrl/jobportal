import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Check
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";

// ✅ Decide which sort icon to display based on current sort field and direction (From image_2333ff.png)
const SortIcon = ({ field, sortField, sortDirection }) => {
  if (sortField !== field) {
    return <ChevronUp className="w-4 h-4 text-gray-400" />;
  }
  return sortDirection === "asc" ? (
    <ChevronUp className="w-4 h-4 text-blue-600" />
  ) : (
    <ChevronDown className="w-4 h-4 text-blue-600" />
  );
};

// ✅ Loading Skeleton Row
const LoadingRow = () => (
  <tr className="animate-pulse">
    <td className="px-5 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </td>
    <td className="px-5 py-4">
      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
    </td>
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded w-8"></div>
    </td>
    <td className="px-5 py-4">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </td>
  </tr>
);

const ManageJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;
  
  // Sample job data (From image_232be4.png)
  const [jobs, setJobs] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (jobId) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.JOBS.TOGGLE_CLOSE(jobId)
      );
      if (response.status === 200) {
        toast.success("Job status updated!");
        getPostedJobs(true);
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error("Failed to update job status.");
    }
  };

  // Delete a specific job (From image_2333ff.png)
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE_JOB(jobId));
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job listing deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // ✅ Filter and sort jobs (From image_232be4.png & image_2328d9.png)
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort jobs logic block
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "applicants") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchTerm, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredAndSortedJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPostedJobs = async (disableLoader) => {
  setIsLoading(!disableLoader);

  try {
  const response = await axiosInstance.get(
    API_PATHS.JOBS.GET_JOBS_EMPLOYER
  );
  console.log("Manage Jobs Response:", response.data); // ✅ இங்கே

    console.log("Jobs API Response:", response.data);

    const jobsData = Array.isArray(response.data)
      ? response.data
      : response.data?.jobs || [];

    const formattedJobs = jobsData.map((job) => ({
      id: job._id,
      title: job?.title || "",
      company: job?.company?.companyName || job?.company?.fullName || "",
      status: job?.isClosed ? "Closed" : "Active",
      applicants: job?.applicationCount || 0,
      datePosted: moment(job?.createdAt).format("DD-MM-YYYY"),
      logo: job?.company?.companyLogo
  ? job.company.companyLogo.startsWith("http")
    ? job.company.companyLogo
    : `http://localhost:8000${job.company.companyLogo}`
  : null,
    }));

    setJobs(formattedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    setJobs([]);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    getPostedJobs();
  }, []);

  const statuses = ["All", "Active", "Closed"];

  return (
    <DashboardLayout activeMenu="manage-jobs">
      <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Job Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your job postings and track applications
                </p>
              </div>
              <button
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-sm text-white font-medium rounded-xl shadow-lg shadow-blue-500/20 transition-all whitespace-nowrap"
                onClick={() => navigate("/post-job")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Job
              </button>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-100/40 border border-gray-100">

            {/* Filter Bar Row */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-row items-center gap-4">

                {/* Search Field */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50 transition-all"
                  />
                </div>

                {/* Dropdown Menu matching video references */}
                <div className="w-48 relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full px-4 py-2 text-sm bg-white border rounded-xl shadow-sm transition-all text-gray-700 font-medium focus:outline-none ${
                      isDropdownOpen
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span>
                      {statusFilter === "All" ? "All Status" : statusFilter}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 z-50 w-full mt-1.5 bg-gray-200/95 backdrop-blur-md border border-gray-300/50 rounded-xl shadow-xl p-1">
                      <div className="py-0.5 space-y-0.5">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setStatusFilter(status);
                              setCurrentPage(1);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-1.5 text-sm text-left rounded-lg transition-colors ${
                              statusFilter === status
                                ? "bg-black/5 text-gray-950 font-medium"
                                : "text-gray-800 hover:bg-white/40 hover:text-gray-900"
                            }`}
                          >
                            <span>
                              {status === "All" ? "All Status" : status}
                            </span>
                            {statusFilter === status && (
                              <Check className="w-3.5 h-3.5 text-gray-800 stroke-[2.5]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500 font-medium">
                Showing {paginatedJobs.length} of {filteredAndSortedJobs.length} jobs
              </p>
            </div>

            {/* Table / Empty Wrapper View Layer (From image_241c27.png) */}
            <div className="">
              {filteredAndSortedJobs.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    No jobs found
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th
                          className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                          onClick={() => handleSort("title")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Job Title</span>
                            <SortIcon field="title" sortField={sortField} sortDirection={sortDirection} />
                          </div>
                        </th>
                        <th
                          className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Status</span>
                            <SortIcon field="status" sortField={sortField} sortDirection={sortDirection} />
                          </div>
                        </th>
                        <th
                          className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
                          onClick={() => handleSort("applicants")}
                        >
                          <div className="flex items-center gap-1.5">
                            <span>Applicants</span>
                            <SortIcon field="applicants" sortField={sortField} sortDirection={sortDirection} />
                          </div>
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                            <LoadingRow key={index} />
                          ))
                        : paginatedJobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50/70 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  {job.logo ? (
                                    <img
                                      src={job.logo}
                                      alt={job.company}
                                      className="w-9 h-9 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                                    />
                                  ) : (
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                      <Briefcase className="w-4 h-4 text-blue-400" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-900 leading-snug">
                                      {job.title}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {job.company} • Posted: {job.datePosted}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                    job.status === "Active"
                                      ? "bg-green-50 text-green-700 border border-green-200"
                                      : "bg-gray-100 text-gray-500 border border-gray-200"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      job.status === "Active" ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                  />
                                  {job.status}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1.5 text-gray-700">
                                  <Users className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="font-medium">{job.applicants}</span>
                                </div>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => navigate(`/applicants?jobId=${job.id}`)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Applications"
                                  >
                                    <Users className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() =>
                                   navigate("/post-job", {
                                    state: { jobId: job.id },
                                   })
                                      }
                                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    title="Edit Job"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleStatusChange(job.id)}
                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title={job.status === "Active" ? "Close Job" : "Reopen Job"}
                                  >
                                    {job.status === "Active" ? (
                                      <ToggleRight className="w-4 h-4" />
                                    ) : (
                                      <ToggleLeft className="w-4 h-4" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Job"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-xs font-medium rounded-lg transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;