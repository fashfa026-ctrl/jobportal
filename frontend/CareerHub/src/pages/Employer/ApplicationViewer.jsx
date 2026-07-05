import { useState, useEffect, useMemo } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  Download,
  Eye,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { getInitials } from "../utils/helper";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/layout/StatusBadge";

// Import the profile preview card component that was missing!
import ApplicantProfilePreview from "../../components/Cards/ApplicantProfilePreview";

const ApplicationViewer = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId") || null;
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_ALL_APPLICATIONS(jobId)
      );
      setApplications(response.data);
    } catch (err) {
      console.log("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplications();
    else setLoading(false);
  }, []);

  const groupedApplications = useMemo(() => {
    const filtered = applications.filter((app) => app.job && app.job.title);
    return filtered.reduce((acc, app) => {
      const jobId = app.job._id;
      if (!acc[jobId]) {
        acc[jobId] = {
          job: app.job,
          applications: [],
        };
      }
      acc[jobId].applications.push(app);
      return acc;
    }, {});
  }, [applications]);

  const getUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `http://localhost:8000${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const handleDownloadResume = (resumeUrl) => {
    if (!resumeUrl) return;
    const url = getUrl(resumeUrl);
    window.open(encodeURI(url), "_blank");
  };

  return (
    <DashboardLayout activeMenu='manage-jobs'>
      {loading ? (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-slate-400">Loading applications...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950/20">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="group flex items-center space-x-2 px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-gray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-md shadow-gray-100/40 hover:shadow-lg cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back</span>
                </button>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Applications Overview
                </h1>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {Object.keys(groupedApplications).length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-808/80">
                <Users className="mx-auto h-16 w-16 text-gray-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  No applications available
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  No candidate applications found at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.values(groupedApplications).map(({ job, applications }) => (
                  <div key={job._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-808/80 shadow-md overflow-hidden transition-colors duration-200">
                    
                    {/* Job Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-650 px-6 py-4.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-bold text-white">
                            {job.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-blue-100/90">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Briefcase className="h-4 w-4" />
                              <span className="text-sm font-medium">{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium bg-white/10 px-2.5 py-0.5 rounded-full">{job.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-center self-start sm:self-auto">
                          <span className="text-sm text-white font-bold">
                            {applications.length} Application
                            {applications.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Applications List */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {applications.map((application) => (
                          <div
                            key={application._id}
                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500/20 dark:hover:border-blue-500/20 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-4">
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                {application.applicant?.avatar ? (
                                  <img
                                    src={encodeURI(getUrl(application.applicant.avatar))}
                                    alt={application.applicant?.fullName}
                                    className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                      {getInitials(application.applicant?.fullName || "?")}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Applicant Info */}
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white leading-snug">
                                  {application.applicant?.fullName || "Unknown"}
                                </h3>
                                <p className="text-gray-600 dark:text-slate-400 text-sm mt-0.5">
                                  {application.applicant?.email}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 dark:text-slate-500 text-xs font-medium">
                                  <Calendar className="h-3.5 h-3.5" />
                                  <span>
                                    Applied {moment(application.createdAt).format("Do MMM YYYY")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-4 md:mt-0">
                              {/* Integrated Status Badge Component display */}
                              <StatusBadge status={application.status} />

                              <button
                                onClick={() => handleDownloadResume(application.applicant?.resume)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer"
                              >
                                <Download className="h-4 w-4" />
                                <span>Resume</span>
                              </button>
                              <button
                                onClick={() => setSelectedApplicant(application)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View Profile</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal Render Block (Added from image_0fd90b.png) */}
      {selectedApplicant && (
        <ApplicantProfilePreview
          selectedApplicant={selectedApplicant}
          setSelectedApplicant={setSelectedApplicant}
          handleDownloadResume={handleDownloadResume}
          handleClose={() => {
            setSelectedApplicant(null);
            fetchApplications();
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default ApplicationViewer;