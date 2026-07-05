import { Bookmark, Building, Building2, Calendar, MapPin } from "lucide-react";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../layout/StatusBadge";

const JobCard = ({ job, onClick, onToggleSave, onApply, saved, hideApply }) => {
  const { user } = useAuth();
  console.log("Job Type:", job?.type); 

  // ✅ NEW: this job has been soft-deleted (removed by employer/admin) but
  // may still appear here because it's referenced from a saved-jobs list or
  // an applications list where we don't filter isDeleted out.
  const isRemoved = job?.isDeleted;

  const formatSalary = (min, max) => {
  if (!min && !max) return "Salary not specified";
  const formatNumber = (num) => {
    const n = Number(num);
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
    return `${n}`;
  };
  return `Rs. ${formatNumber(min || max)}/m`;
};

  const getLogoUrl = (logo) => {
    if (!logo) return null;
    const base = "http://localhost:8000";
    return logo.startsWith("http") ? logo : encodeURI(`${base}${logo.startsWith("/") ? "" : "/"}${logo}`);
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 p-6 transition-all duration-300 group relative overflow-hidden ${
        isRemoved
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-xl hover:shadow-gray-200 cursor-pointer"
      }`}
      onClick={isRemoved ? undefined : onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {job?.company?.companyLogo ? (
            <img
              src={getLogoUrl(job.company.companyLogo)}
              alt="Company Logo"
              className="w-14 h-14 object-cover rounded-2xl border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
          )}

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
              {job?.title}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <Building className="w-3.5 h-3.5" />
              {job?.company?.companyName || job?.company?.name}
            </p>
          </div>
        </div>

        {user && !isRemoved && (
          <button
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          >
            <Bookmark
              className={`w-5 h-5 hover:text-blue-600 ${
                job?.isSaved || saved ? "text-blue-600 fill-blue-600" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      {/* ✅ NEW: removed-job banner (LinkedIn/Indeed style "No longer accepting applications") */}
      {isRemoved && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-xs font-medium px-3 py-2 rounded-xl">
          This job has been removed by the employer
        </div>
      )}

      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
            <MapPin className="w-3 h-3" />
            {job?.location}
          </span>
         {job?.type && (
  <span
    className={`px-3 py-1 rounded-full font-medium ${
      job?.type === "Full-Time"
        ? "bg-green-100 text-green-800"
        : job?.type === "Part-Time"
        ? "bg-yellow-100 text-yellow-800"
        : job?.type === "Contract"
        ? "bg-purple-100 text-purple-800"
        : "bg-blue-100 text-blue-800"
    }`}
  >
    {job?.type}
  </span>
)}
          {job?.category && (
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
              {job?.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-5 pb-4 border-b border-gray-100">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {job?.createdAt
            ? moment(job.createdAt).format("Do MMM YYYY")
            : "N/A"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-blue-600 font-semibold text-lg">
          {formatSalary(job?.salaryMin, job?.salaryMax)}
        </div>
        {!saved && (
          <>
            {job?.applicationStatus ? (
              <StatusBadge status={job?.applicationStatus} />
            ) : (
              !hideApply &&
              !isRemoved && (
                <button
                  className="bg-gradient-to-r from-blue-50 to-blue-50 text-sm text-blue-700 hover:text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-200 font-semibold transform hover:-translate-y-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply();
                  }}
                >
                  Apply Now
                </button>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobCard;