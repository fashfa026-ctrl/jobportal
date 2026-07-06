import {
  MapPin,
  ArrowLeft,
  Building2,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import { CATEGORIES, JOB_TYPES } from "../../pages/utils/data";
import { useAuth } from "../../context/AuthContext";

const JobPostingPreview = ({ formData, setIsPreview }) => {
  const { user } = useAuth();

  const formatDeadline = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 bg-white shadow-xl rounded-2xl px-6 pt-6 pb-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Job Preview</h2>
            <button
              onClick={() => setIsPreview(false)}
              className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Edit</span>
            </button>
          </div>

          {/* Title + Location + Logo */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                {formData.jobTitle}
              </h1>
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">
                  {formData.location || "Location not specified"}
                </span>
              </div>
            </div>

            {/* Logo */}
            <div className="ml-4">
             {user?.companyLogo ? (
  <img
    src={
      user.companyLogo.startsWith("http")
        ? user.companyLogo
        : encodeURI(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${user.companyLogo.startsWith("/") ? "" : "/"}${user.companyLogo}`)
    }
    alt="Company Logo"
    className="h-14 w-14 object-cover rounded-xl border border-gray-200"
  />
              ) : (
                <div className="h-14 w-14 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            <span className="px-3 py-1.5 bg-blue-50 text-sm text-blue-700 font-medium rounded-full border border-blue-200">
              {CATEGORIES.find((c) => c.value === formData.category)?.label}
            </span>
            <span className="px-3 py-1.5 bg-purple-50 text-sm text-purple-700 font-medium rounded-full border border-purple-200">
              {JOB_TYPES.find((j) => j.value === formData.jobType)?.label}
            </span>
            {formData.experience && (
              <span className="px-3 py-1.5 bg-yellow-50 text-sm text-yellow-700 font-medium rounded-full border border-yellow-200">
                {formData.experience}
              </span>
            )}
            {formData.deadline && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-sm text-red-700 font-medium rounded-full border border-red-200">
                <Calendar className="h-3.5 w-3.5" />
                {formatDeadline(formData.deadline)}
              </span>
            )}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-sm text-gray-700 font-medium rounded-full border border-gray-200">
              <Clock className="h-3.5 w-3.5" />
              <span>Posted today</span>
            </div>
          </div>

          {/* Salary Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white">
                    <span className="text-white text-sm font-bold">Rs.</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Compensation
                    </h3>
                    <div className="text-sm md:text-lg font-bold text-gray-900">
                      Rs. {formData.salaryMin?.toLocaleString()} -{" "}
                      Rs. {formData.salaryMax?.toLocaleString()}
                      <span className="text-sm md:text-lg text-gray-600 font-normal">
                        {" "}per month
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-lg font-medium">
                  <Users className="h-4 w-4" />
                  <span>Competitive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description + Requirements */}
          <div className="space-y-6 mt-6">

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-base font-semibold text-gray-900">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                <span>About This Role</span>
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {formData.description}
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-3 text-base font-semibold text-gray-900">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                <span>What We're Looking For</span>
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-6">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {formData.requirements}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default JobPostingPreview;