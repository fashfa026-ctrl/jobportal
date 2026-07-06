import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import Navbar from "../../components/layout/Navbar";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Upload,
  FileText,
  Trash2,
  Briefcase,
  MapPin,
  Calendar,
  Download,
  Clock,
  Monitor,
  Video,
  Phone,
  FileCheck,
  UserCircle,
  StickyNote,
  ExternalLink,
} from "lucide-react";
import moment from "moment";

const UserProfile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({ fullName: "", email: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [applications, setApplications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName || "", email: user.email || "" });
      setAvatarPreview(
        user.avatar
          ? user.avatar.startsWith("http")
            ? user.avatar
            : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${user.avatar}`
          : ""
      );
    }
  }, [user]);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      setLoadingApps(true);
      const response = await axiosInstance.get(API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS);
      // ✅ CHANGED: with soft-delete, app.job is never null (the job document
      // still exists, just flagged isDeleted: true). So we keep ALL
      // applications here and show a "removed" badge for deleted jobs below,
      // instead of silently dropping them from the list.
      setApplications(response.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("fullName", formData.fullName);
      if (avatarFile) data.append("avatar", avatarFile);
      if (resumeFile) data.append("resume", resumeFile);
      const response = await axiosInstance.put(API_PATHS.USERS.UPDATE_PROFILE, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;
    try {
      await axiosInstance.post(API_PATHS.USERS.DELETE_RESUME);
      setUser({ ...user, resume: "" });
      toast.success("Resume deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete resume.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-700 border border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border border-red-200";
      case "in review": return "bg-blue-100 text-blue-700 border border-blue-200";
      default: return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  // ✅ Professional Interview Invitation Card
  const InterviewCard = ({ details }) => {
    const modeIcon =
      details.type === "Physical" || details.mode === "Physical"
        ? <Monitor className="w-4 h-4 text-violet-500" />
        : details.type === "Phone" || details.mode === "Phone"
        ? <Phone className="w-4 h-4 text-violet-500" />
        : <Video className="w-4 h-4 text-violet-500" />;

    const mode = details.type || details.mode || "Online";

    return (
      <div className="mt-4 w-full rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 overflow-hidden shadow-sm">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Interview Invitation</p>
            <p className="text-violet-200 text-xs">You have been selected for an interview</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">

          {/* Date & Time */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-violet-100">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Date & Time</p>
              <p className="text-sm font-semibold text-gray-900">
                {details.date ? moment(details.date).format("DD MMM YYYY") : ""}{" "}
                {details.time ? `at ${details.time}` : ""}
              </p>
            </div>
          </div>

          {/* Mode */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-violet-100">
            <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              {modeIcon}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Interview Mode</p>
              <p className="text-sm font-semibold text-gray-900">{mode}</p>
              {details.meetingLink && (
                <a
                  href={details.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium mt-0.5"
                >
                  <ExternalLink className="w-3 h-3" /> Join Meeting Link
                </a>
              )}
            </div>
          </div>

          {/* Documents Required */}
          {details.documents && details.documents.length > 0 && (
            <div className="bg-white rounded-xl p-3 border border-violet-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Documents Required</p>
              </div>
              <ul className="space-y-1 ml-11">
                {details.documents.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Person */}
          {details.contact && (
            <div className="bg-white rounded-xl p-3 border border-violet-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <UserCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium">Contact Person</p>
              </div>
              <div className="ml-11 space-y-0.5">
                <p className="text-sm font-semibold text-gray-900">
                  {details.contact.name}
                  {details.contact.position && (
                    <span className="font-normal text-gray-500"> — {details.contact.position}</span>
                  )}
                </p>
                {details.contact.email && (
                  <p className="text-xs text-gray-600">{details.contact.email}</p>
                )}
                {details.contact.phone && (
                  <p className="text-xs text-gray-600">{details.contact.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {details.notes && (
            <div className="flex items-start gap-3 bg-white rounded-xl p-3 border border-violet-100">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <StickyNote className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Additional Notes</p>
                <p className="text-sm text-gray-700 italic">{details.notes}</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-violet-100/60 border-t border-violet-200">
          <p className="text-xs text-violet-600 text-center font-medium">
            Best of luck with your interview! 🎯
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="pt-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Profile Card */}
          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
              <div className="relative mb-4">
                {avatarPreview ? (
                  <img src={encodeURI(avatarPreview)} alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center border-4 border-blue-100">
                    <span className="text-white text-2xl font-bold">
                      {user?.fullName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{user?.fullName}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full capitalize">
                {user?.role}
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Resume
              </h3>
              {user?.resume ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700 truncate max-w-[120px]">Resume.pdf</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(
                        user.resume.startsWith("http") ? user.resume : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${user.resume}`,
                        "_blank"
                      )}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={handleDeleteResume}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Upload Resume (PDF)</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
                </label>
              )}
              {resumeFile && (
                <p className="mt-2 text-xs text-green-600 font-medium">✓ {resumeFile.name} selected</p>
              )}
            </div>
          </div>

          {/* Right — Edit Form + Applications */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={formData.email} disabled
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <button onClick={handleSubmit} disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Applied Jobs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Applied Jobs
              </h3>

              {loadingApps ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No applications yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id}
                      className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition">
                      
                      {/* Job Info Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {app.job?.title || "Unknown Job"}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            {app.job?.location && (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" /> {app.job.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {moment(app.createdAt).format("DD MMM YYYY")}
                            </span>
                          </div>
                          {/* ✅ NEW: LinkedIn/Indeed style notice when the employer
                              has removed the job listing this application was for */}
                          {app.job?.isDeleted && (
                            <p className="mt-2 inline-block text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">
                              This job has been removed by the employer
                            </p>
                          )}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${getStatusColor(app.status)}`}>
                          {app.status || "applied"}
                        </span>
                      </div>

                      {/* ✅ Professional Interview Card */}
                      {app.status === "accepted" && app.interviewDetails?.date && (
                        <InterviewCard details={app.interviewDetails} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;