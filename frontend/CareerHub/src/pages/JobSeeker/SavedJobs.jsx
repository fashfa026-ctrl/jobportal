import {
  ArrowLeft,
  Bookmark,
  Grid,
  List,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import JobCard from "../../components/Cards/JobCard";
import toast from "react-hot-toast";

const SavedJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [savedJobList, setSavedJobList] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  const getSavedJobs = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.JOBS.GET_SAVED_JOBS);
    console.log("Saved Jobs:", JSON.stringify(response.data[0], null, 2)); // ✅ இந்த line சேர்க்கவும்
    setSavedJobList(response.data);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
  }
};

  const handleUnsaveJob = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
      toast.success("Job removed successfully!");
      getSavedJobs();
    } catch (err) {
      toast.error("Something went wrong! Try again later");
    }
  };

  const applyToJob = async (jobId) => {
    if (user?.role !== "jobseeker") {
      toast.error("Only Job Seekers can apply for jobs!");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      toast.success("Applied to job successfully!");
      getSavedJobs();
    } catch (err) {
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  useEffect(() => {
    if (user) {
      getSavedJobs();
    }
  }, [user]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-white bg-white/50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>

              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                Saved Jobs
              </h1>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {savedJobList.length === 0 ? (
            <div className="text-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-100">
              <div className="text-gray-300 mb-6">
                <Bookmark className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                You haven't saved any jobs yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start saving jobs that interest you to view them later.
              </p>
              <button
                onClick={() => navigate('/find-jobs')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6"
                  : "space-y-4 lg:space-y-6"
              }
            >
              {savedJobList.map((item) => (
  <JobCard
    key={item._id}
    job={{ ...item.job, isSaved: true }} 
    onClick={() => navigate(`/job/${item.job?._id}`)}
    onToggleSave={() => handleUnsaveJob(item.job?._id)}
    onApply={() => applyToJob(item.job?._id)}
    saved={true} 
  />
))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SavedJobs;