import DashboardLayout from '../../components/layout/DashboardLayout';
import InputField from "../../components/Input/InputField";
import SelectField from "../../components/Input/SelectField";
import TextareaField from "../../components/Input/TextareaField";
import JobPostingPreview from "../../components/Cards/JobPostingPreview";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  AlertCircle,
  MapPin,
  Briefcase,
  Users,
  Eye,
  Send,
  Clock,
  Calendar,
} from "lucide-react";
import { API_PATHS } from "../utils/apiPaths";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { CATEGORIES, JOB_TYPES } from "../utils/data";
import toast from "react-hot-toast";

/*const EXPERIENCE_LEVELS = [
  { value: "Entry Level", label: "Entry Level (0-1 years)" },
  { value: "Junior", label: "Junior (1-2 years)" },
  { value: "Mid Level", label: "Mid Level (2-5 years)" },
  { value: "Senior", label: "Senior (5+ years)" },
  { value: "Lead", label: "Lead / Manager" },
];*/

const JobPostingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.jobId;
  const isEditMode = Boolean(jobId);

  const [formData, setFormData] = useState({
    jobTitle: "",
    location: "",
    category: "",
    jobType: "",
    experience: "",
    deadline: "",
    description: "",
    requirements: "",
    salaryMin: "",
    salaryMax: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      try {
        const response = await axiosInstance.get(
          API_PATHS.JOBS.GET_JOB_BY_ID(jobId)
        );
        const jobData = response.data;
        if (jobData) {
          setFormData({
            jobTitle: jobData.title || jobData.jobTitle || "",
            location: jobData.location || "",
            category: jobData.category || "",
            jobType: jobData.type || jobData.jobType || "",
            experience: jobData.experience || "",
            deadline: jobData.deadline
              ? new Date(jobData.deadline).toISOString().split("T")[0]
              : "",
            description: jobData.description || "",
            salaryMin: jobData.salaryMin || "",
            salaryMax: jobData.salaryMax || "",
            requirements: Array.isArray(jobData.requirements)
              ? jobData.requirements.join(", ")
              : jobData.requirements || "",
          });
        }
      } catch (error) {
        console.error("Error loading job:", error);
        const errMsg = error.response?.data?.message || "Failed to load job details";
        toast.error(errMsg);
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    // ✅ FIX: backend Job model expects requirements as [String]. Split the
    // free-text textarea on commas/newlines so each requirement becomes its
    // own array item, instead of saving the whole textarea as one string.
    const requirementsArray = formData.requirements
      .split(/[,\n]/)
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const jobPayload = {
      title: formData.jobTitle,
      description: formData.description,
      requirements: requirementsArray,
      location: formData.location,
      category: formData.category,
      type: formData.jobType,
      experience: formData.experience,
      deadline: formData.deadline,
      salaryMin: formData.salaryMin,
      salaryMax: formData.salaryMax,
    };
    try {
      const response = jobId
        ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId), jobPayload)
        : await axiosInstance.post(API_PATHS.JOBS.POST_JOB, jobPayload);
      if (response.status === 200 || response.status === 201) {
        toast.success(isEditMode ? "Job Updated Successfully!" : "Job Posted Successfully!");
        navigate("/employer/dashboard");
        return;
      }
      toast.error("Something went wrong. Please try again.");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to process your job request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.jobTitle.trim()) errors.jobTitle = "Job title is required";
    if (!formData.category) errors.category = "Please select a category";
    if (!formData.jobType) errors.jobType = "Please select a job type";
    if (!formData.description.trim()) errors.description = "Job description is required";
    if (!formData.requirements || String(formData.requirements).trim() === "")
      errors.requirements = "Job requirements are required";
    if (!formData.salaryMin || !formData.salaryMax) {
      errors.salary = "Both minimum and maximum salary are required";
    } else if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      errors.salary = "Maximum salary must be greater than minimum salary";
    }
    return errors;
  };

  const isFormValid = () => Object.keys(validateForm(formData)).length === 0;

  if (isPreview) {
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="post-job">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {isEditMode ? "Modify Job Posting" : "Post a New Job"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {isEditMode ? "Update your current listing information details" : "Fill out the form below to create your job posting"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                disabled={!isFormValid()}
                className="group flex items-center space-x-2 px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Eye className="h-4 w-4 text-gray-500" />
                <span>Preview</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <InputField
                label="Job Title"
                id="jobTitle"
                placeholder="e.g., Senior Frontend Developer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                error={errors.jobTitle}
                required
                icon={Briefcase}
              />
              

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Location"
                  id="location"
                  placeholder="e.g., Kandy"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  error={errors.location}
                  icon={MapPin}
                />
                {/* <SelectField
                  label="Experience Level"
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  options={EXPERIENCE_LEVELS}
                  placeholder="Select experience level"
                  error={errors.experience}
                  icon={Clock}
                />*/}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Category"
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  options={CATEGORIES}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                  icon={Users}
                />
                <SelectField
                  label="Job Type"
                  id="jobType"
                  value={formData.jobType}
                  onChange={(e) => handleInputChange("jobType", e.target.value)}
                  options={JOB_TYPES}
                  placeholder="Select job type"
                  error={errors.jobType}
                  required
                  icon={Briefcase}
                />
              </div>

              {/* Deadline — ✅ now wrapped in .job-deadline-picker for custom calendar theme (see <style> at bottom) */}
              <div className="space-y-1 job-deadline-picker">
                <label className="block text-sm font-medium text-gray-700">
                  Application Deadline
                </label>
                <div className="group relative rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <DatePicker
                      selected={formData.deadline ? new Date(formData.deadline) : null}
                      onChange={(date) =>
                        handleInputChange(
                          "deadline",
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      minDate={new Date()}
                      dateFormat="dd MMM yyyy"
                      placeholderText="Select deadline"
                      className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <TextareaField
                label="Job Description"
                id="description"
                placeholder="Describe the role and responsibilities..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                helperText="Include key responsibilities, day-to-day tasks, and what makes this role exciting"
                required
              />

              <TextareaField
                label="Requirements"
                id="requirements"
                placeholder="List key qualifications and skills..."
                value={formData.requirements}
                onChange={(e) => handleInputChange("requirements", e.target.value)}
                error={errors.requirements}
                helperText="Include required skills, experience level, education, and any preferred qualifications"
                required
              />

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Salary Range <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <span className="text-sm font-medium text-gray-400">Rs.</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={formData.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <span className="text-sm font-medium text-gray-400">Rs.</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={formData.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className="flex items-center space-x-1.5 text-sm text-red-600 mt-1">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="w-full sm:w-auto min-w-[160px] flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <span>{isEditMode ? "Save Changes" : "Publish Job"}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Custom calendar theme — matches the blue/purple gradient used in ApplicantProfilePreview */}
      <style>{`
        .job-deadline-picker .react-datepicker-wrapper {
          width: 100%;
        }
        .job-deadline-picker .react-datepicker__input-container input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }
        .job-deadline-picker .react-datepicker-popper {
          z-index: 60;
        }
        .job-deadline-picker .react-datepicker {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .job-deadline-picker .react-datepicker__header {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          border-bottom: none;
          padding-top: 0.75rem;
        }
        .job-deadline-picker .react-datepicker__current-month {
          color: #ffffff;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .job-deadline-picker .react-datepicker__day-name {
          color: #e0e7ff;
          font-weight: 500;
        }
        .job-deadline-picker .react-datepicker__navigation-icon::before {
          border-color: #ffffff;
        }
        .job-deadline-picker .react-datepicker__day {
          border-radius: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        .job-deadline-picker .react-datepicker__day:hover {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .job-deadline-picker .react-datepicker__day--selected,
        .job-deadline-picker .react-datepicker__day--keyboard-selected {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          color: #ffffff;
        }
        .job-deadline-picker .react-datepicker__day--today {
          font-weight: 700;
          color: #ffffff;
        }
        .job-deadline-picker .react-datepicker__day--disabled {
          color: #d1d5db;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default JobPostingForm;