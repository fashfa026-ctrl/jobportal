import {
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
  Calendar,
  Eye,
  Share2,
  Flag,
  ArrowLeft,
  Globe,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import Navbar from "../../components/layout/Navbar";
import StatusBadge from "../../components/layout/StatusBadge";
import ShareButton from "../../components/layout/ShareButton";

const JobDetails = () => {
  const { user } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobDetails, setJobDetails] = useState(null);

  const getJobDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.JOBS.GET_JOB_BY_ID(jobId)
      );
      setJobDetails(response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const isJobExpired = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "No deadline";
    return moment(deadline).format("DD MMM YYYY");
  };

  useEffect(() => {
    if (jobId) {
      getJobDetailsById();
    }
  }, [jobId]);

  const applyToJob = async () => {
    if (user?.role !== "jobseeker") {
      toast.error("Only Job Seekers can apply for jobs!");
      return;
    }
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      toast.success("Applied to job successfully");
      getJobDetailsById();
    } catch (err) {
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: jobDetails?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      // user cancelled share sheet — no-op
    }
  };

  const handleReport = async () => {
    const reason = prompt("Why are you reporting this job?");
    if (reason === null) return; // User cancelled the prompt
    if (!reason.trim()) {
      toast.error("Please provide a reason for reporting.");
      return;
    }

    try {
      await axiosInstance.post("/api/reports", { jobId, reason });
      toast.success("Thanks for letting us know. Our team will review this listing.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report. Please try again.");
    }
  };

  return (
    // ✅ Plain slate background — gradient backgrounds reserved for hero/marketing sections only
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto pt-24 px-4 pb-12 max-w-6xl">

        {jobDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ============ LEFT: Main job content ============ */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">

              {/* Hero Section */}
              <div className="pb-5 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {jobDetails?.company?.companyLogo ? (
                      <img
                        src={
                          jobDetails.company.companyLogo.startsWith("http")
                            ? jobDetails.company.companyLogo
                            : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${jobDetails.company.companyLogo}`
                        }
                        alt="Company Logo"
                        className="h-14 w-14 object-cover rounded-2xl border border-slate-200"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-center">
                        <Building2 className="h-7 w-7 text-slate-400" />
                      </div>
                    )}

                    <div>
                      <h1 className="text-lg lg:text-xl font-bold text-slate-900 mb-0.5 leading-tight">
                        {jobDetails.title}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {jobDetails?.company?.companyName && (
                          <>
                            {jobDetails.company.companyWebsite ? (
                              
                               <a href={jobDetails.company.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-slate-600 hover:text-indigo-600 hover:underline transition"
                              >
                                {jobDetails.company.companyName}
                              </a>
                            ) : (
                              <span className="font-medium text-slate-600">
                                {jobDetails.company.companyName}
                              </span>
                            )}
                            <span className="text-slate-300">•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {jobDetails.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* applicants badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-xs text-slate-500 flex-shrink-0">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium text-slate-700">
                      {jobDetails.applicationCount ?? 0}
                    </span>
                    applicants
                  </div>
                </div>

                {/* Tags — ✅ Primary tint for category, neutral for everything else (was blue/purple/gray mix) */}
                <div className="flex flex-wrap gap-2.5 mt-4">
                  <span className="px-3.5 py-1 bg-indigo-50 text-sm text-indigo-700 font-medium rounded-full">
                    {jobDetails.category}
                  </span>
                  <span className="px-3.5 py-1 bg-slate-100 text-sm text-slate-700 font-medium rounded-full">
                    {jobDetails.type}
                  </span>
                  <div className="flex items-center gap-1.5 px-3.5 py-1 bg-slate-50 rounded-full text-sm text-slate-600">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {jobDetails.createdAt
                        ? moment(jobDetails.createdAt).format("Do MMM YYYY")
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="mt-5 space-y-6">

                {/* Salary Section — ✅ Success color (emerald) instead of a separate teal/green gradient */}
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-600 rounded-xl">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 mb-0.5">
                          Salary Range
                        </h3>
                        <div className="text-lg font-bold text-slate-900">
                          Rs. {jobDetails.salaryMin?.toLocaleString()} - {jobDetails.salaryMax?.toLocaleString()}
                          <span className="text-sm text-slate-600 font-normal ml-1">
                            per month
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span className={isJobExpired(jobDetails.deadline) ? "text-red-600 font-medium" : "text-emerald-700"}>
                        {isJobExpired(jobDetails.deadline) ? "Expired" : "Expires"} {formatDeadline(jobDetails.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* About This Role — ✅ Indicator bar now solid primary, not a gradient */}
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-1 h-5 bg-indigo-600 rounded-full" />
                    About This Role
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {jobDetails.description}
                    </p>
                  </div>
                </div>

                {/* Requirements — ✅ Indicator bar now solid accent, card neutral instead of pink/purple gradient */}
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-1 h-5 bg-violet-600 rounded-full" />
                    What We're Looking For
                  </h3>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {Array.isArray(jobDetails.requirements)
                        ? jobDetails.requirements.join("\n")
                        : jobDetails.requirements}
                    </p>
                  </div>
                </div>

              </div>

              {/* Apply button — scrolls with content */}
              <div className="mt-6">
                {jobDetails?.applicationStatus ? (
                  <div className="flex justify-center">
                    <StatusBadge status={jobDetails.applicationStatus} />
                  </div>
                ) : (
                  <button
                    onClick={applyToJob}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                  >
                    Apply Now
                  </button>
                )}
              </div>

              {/* Footer: share / report / views / posted date */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <ShareButton url={window.location.href} title={jobDetails.title} />
                  <button
                    onClick={handleReport}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    Report
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted on {jobDetails.createdAt ? moment(jobDetails.createdAt).format("DD MMM YYYY") : "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    Viewed {jobDetails.views ?? 0} times
                  </span>
                </div>
              </div>

            </div>

            {/* ============ RIGHT: Company sidebar (sticky on desktop) ============ */}
            {jobDetails?.company && (
              <div className="lg:col-span-1">
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 lg:sticky lg:top-24 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-1 h-4 bg-indigo-600 rounded-full" />
                    About the Company
                  </h3>

                  <div className="flex items-center gap-3">
                    {jobDetails.company.companyLogo ? (
                      <img
                        src={jobDetails.company.companyLogo.startsWith("http")
                          ? jobDetails.company.companyLogo
                          : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${jobDetails.company.companyLogo}`}
                        alt="Logo"
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-slate-400" />
                      </div>
                    )}
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {jobDetails.company.companyName}
                    </h4>
                  </div>

                  {jobDetails.company.companyDescription && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {jobDetails.company.companyDescription}
                    </p>
                  )}

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {jobDetails.company.companyLocation && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        {jobDetails.company.companyLocation}
                      </div>
                    )}
                    {jobDetails.company.companyWebsite && (
                      
                       <a href={jobDetails.company.companyWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                        Visit website
                      </a>
                    )}
                    {jobDetails.company.companyPhone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        {jobDetails.company.companyPhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-4 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>
      </div>
    </div>
  );
};

export default JobDetails;