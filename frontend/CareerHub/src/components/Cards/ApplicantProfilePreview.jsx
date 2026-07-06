import { Download, X, Check, XCircle, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getInitials } from "../../pages/utils/helper";
import moment from "moment";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";
import toast from "react-hot-toast";
import StatusBadge from "../layout/StatusBadge";

const getUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}${path.startsWith("/") ? "" : "/"}${path}`;
};

const statusOptions = [
  { value: "applied", label: "Applied", color: "yellow" },
  { value: "in review", label: "In Review", color: "blue" },
  { value: "accepted", label: "Accepted", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" }
];

const ApplicantProfilePreview = ({
  selectedApplicant,
  setSelectedApplicant,
  handleDownloadResume,
  handleClose,
}) => {
  const [currentStatus, setCurrentStatus] = useState(selectedApplicant.status);
  const [loading, setLoading] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(selectedApplicant.status === "accepted");

  const initialDate = selectedApplicant.interviewDetails?.date
    ? new Date(selectedApplicant.interviewDetails.date)
    : null;
  const initialTime = selectedApplicant.interviewDetails?.time
    ? moment(selectedApplicant.interviewDetails.time, ["h:mm A", "HH:mm"]).toDate()
    : null;

  const [interviewDate, setInterviewDate] = useState(initialDate);
  const [interviewTime, setInterviewTime] = useState(initialTime);

  const [interviewDetails, setInterviewDetails] = useState({
    location: selectedApplicant.interviewDetails?.location || "",
    mode: selectedApplicant.interviewDetails?.mode || "Online",
    meetingLink: selectedApplicant.interviewDetails?.meetingLink || "",
    notes: selectedApplicant.interviewDetails?.notes || "",
    title: selectedApplicant.interviewDetails?.title || "",
    documentsString: (selectedApplicant.interviewDetails?.documents || []).join("\n"),
    contactName: selectedApplicant.interviewDetails?.contact?.name || "",
    contactPosition: selectedApplicant.interviewDetails?.contact?.position || "",
    contactEmail: selectedApplicant.interviewDetails?.contact?.email || "",
    contactPhone: selectedApplicant.interviewDetails?.contact?.phone || "",
    dressCode: selectedApplicant.interviewDetails?.dressCode || "",
    arrivalInstructions: selectedApplicant.interviewDetails?.arrivalInstructions || "",
  });

  const applicant = selectedApplicant?.applicant;
  const job = selectedApplicant?.job;

  const onChangeStatus = async (newStatus) => {
    const status = typeof newStatus === 'string' ? newStatus : newStatus.value;

    setCurrentStatus(status);
    setShowInterviewForm(status === "accepted");

    const payload = { status };
    if (status !== "accepted") {
      payload.interviewDetails = undefined;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplicant._id),
        payload
      );
      if (response.status === 200) {
        setSelectedApplicant({ ...selectedApplicant, status });
        if (status === "accepted") {
          toast.success("Application accepted! Please add interview details.");
        } else {
          toast.success("Application status updated successfully");
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setCurrentStatus(selectedApplicant.status);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInterviewDetails = async () => {
    if (!interviewDetails.location || !interviewDate || !interviewTime || !interviewDetails.mode) {
      toast.error("Please fill all interview details");
      return;
    }

    setLoading(true);
    try {
      const documents = interviewDetails.documentsString
        ? interviewDetails.documentsString.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];

      const formattedTime = moment(interviewTime).format("h:mm A");

      const payloadDetails = {
        title: interviewDetails.title,
        type: interviewDetails.mode || "Physical",
        location: interviewDetails.location,
        date: interviewDate,
        time: formattedTime,
        documents,
        contact: {
          name: interviewDetails.contactName,
          position: interviewDetails.contactPosition,
          email: interviewDetails.contactEmail,
          phone: interviewDetails.contactPhone,
        },
        meetingLink: interviewDetails.meetingLink,
        notes: interviewDetails.notes,
      };

      const response = await axiosInstance.put(
        API_PATHS.APPLICATIONS.UPDATE_STATUS(selectedApplicant._id),
        {
          status: "accepted",
          interviewDetails: payloadDetails,
        }
      );
      if (response.status === 200) {
        setSelectedApplicant({
          ...selectedApplicant,
          status: "accepted",
          interviewDetails: {
            ...payloadDetails,
          }
        });
        toast.success("Interview details saved successfully!");
        setShowInterviewForm(false);
      }
    } catch (err) {
      console.error("Error saving interview details:", err);
      toast.error("Failed to save interview details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between border-b border-blue-800">
          <div>
            <h2 className="text-lg font-bold text-white">Applicant Profile Review</h2>
            <p className="text-blue-100 text-xs mt-1">Make hiring decisions efficiently</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Avatar + Name Section */}
          <div className="flex flex-col items-center text-center border-b pb-6">
            {applicant?.avatar ? (
              <img
                src={encodeURI(getUrl(applicant.avatar))}
                alt={applicant?.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 mb-4 shadow-md"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-md">
                <span className="text-white text-3xl font-bold">
                  {getInitials(applicant?.fullName || "?")}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900">
              {applicant?.fullName || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-1">
              <span>📧</span> {applicant?.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Position Applied For */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Position</p>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {job?.title || "Unknown Position"}
                  </h4>
                  <div className="flex gap-2 mt-2 text-xs text-gray-600">
                    <span>📍 {job?.location}</span>
                    <span>•</span>
                    <span>{job?.type}</span>
                  </div>
                </div>
              </div>

              {/* Application Timeline */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">Applied</span>
                    <span className="text-sm font-medium text-gray-900">
                      {moment(selectedApplicant?.createdAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">Status</span>
                    <StatusBadge status={currentStatus} />
                  </div>
                </div>
              </div>

              {/* Resume Download */}
              {applicant?.resume && (
                <button
                  type="button"
                  onClick={() => {
                    const url = getUrl(applicant.resume);
                    if (!url) return;
                    window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition shadow-md cursor-pointer z-50"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Quick Action Buttons */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Decision</p>
                <div className="space-y-2">
                  <button
                    onClick={() => onChangeStatus("accepted")}
                    disabled={loading || currentStatus === "accepted"}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition border ${
                      currentStatus === "accepted"
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-white text-green-600 border-green-200 hover:bg-green-50"
                    } disabled:opacity-50`}
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => onChangeStatus("rejected")}
                    disabled={loading || currentStatus === "rejected"}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition border ${
                      currentStatus === "rejected"
                        ? "bg-red-50 text-red-700 border-red-300"
                        : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                    } disabled:opacity-50`}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => onChangeStatus("in review")}
                    disabled={loading || currentStatus === "in review"}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition border ${
                      currentStatus === "in review"
                        ? "bg-blue-50 text-blue-700 border-blue-300"
                        : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    } disabled:opacity-50`}
                  >
                    👁️ Review
                  </button>
                </div>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Change Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => onChangeStatus(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer disabled:opacity-50"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interview Details Section */}
          {(showInterviewForm || (currentStatus === "accepted" && selectedApplicant.interviewDetails?.location)) && (
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-gray-900">Interview Details</h3>
              </div>

              {currentStatus === "accepted" && !selectedApplicant.interviewDetails?.location && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">Schedule interview details for the candidate</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interview Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., Conference Room A / Google Meet"
                      value={interviewDetails.location}
                      onChange={(e) => setInterviewDetails({...interviewDetails, location: e.target.value})}
                      disabled={currentStatus !== "accepted"}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Date & Time pickers — react-datepicker, custom styled to match app theme */}
                <div className="grid grid-cols-2 gap-4 interview-datepicker">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interview Date</label>
                    <div className="group relative rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 has-[:disabled]:opacity-50 has-[:disabled]:bg-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <DatePicker
                          selected={interviewDate}
                          onChange={(date) => setInterviewDate(date)}
                          disabled={currentStatus !== "accepted"}
                          dateFormat="dd MMM yyyy"
                          placeholderText="Select date"
                          minDate={new Date()}
                          className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interview Time</label>
                    <div className="group relative rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 px-3.5 py-3 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 has-[:disabled]:opacity-50 has-[:disabled]:bg-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-focus-within:bg-blue-600 group-focus-within:text-white transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <DatePicker
                          selected={interviewTime}
                          onChange={(time) => setInterviewTime(time)}
                          disabled={currentStatus !== "accepted"}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          placeholderText="Select time"
                          className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interview Mode</label>
                  <select
                    value={interviewDetails.mode}
                    onChange={(e) => setInterviewDetails({...interviewDetails, mode: e.target.value})}
                    disabled={currentStatus !== "accepted"}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="Online">Online</option>
                    <option value="Physical">Physical</option>
                  </select>
                </div>

                {interviewDetails.mode === "Online" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                    <input
                      type="url"
                      placeholder="https://meet.example.com/abc"
                      value={interviewDetails.meetingLink}
                      onChange={(e) => setInterviewDetails({...interviewDetails, meetingLink: e.target.value})}
                      disabled={currentStatus !== "accepted"}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    rows="3"
                    value={interviewDetails.notes}
                    onChange={(e) => setInterviewDetails({...interviewDetails, notes: e.target.value})}
                    disabled={currentStatus !== "accepted"}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Documents Required (one per line)</label>
                  <textarea
                    rows="3"
                    value={interviewDetails.documentsString}
                    onChange={(e) => setInterviewDetails({...interviewDetails, documentsString: e.target.value})}
                    disabled={currentStatus !== "accepted"}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={interviewDetails.contactName}
                      onChange={(e) => setInterviewDetails({...interviewDetails, contactName: e.target.value})}
                      disabled={currentStatus !== "accepted"}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Position</label>
                    <input
                      type="text"
                      value={interviewDetails.contactPosition}
                      onChange={(e) => setInterviewDetails({...interviewDetails, contactPosition: e.target.value})}
                      disabled={currentStatus !== "accepted"}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={interviewDetails.contactEmail}
                      onChange={(e) => setInterviewDetails({...interviewDetails, contactEmail: e.target.value})}
                      disabled={currentStatus !== "accepted"}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="text"
                      value={interviewDetails.contactPhone}
                      onChange={(e) => setInterviewDetails({...interviewDetails, contactPhone: e.target.value})}
                      disabled={currentStatus !== "accepted"}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>



                {currentStatus === "accepted" && !selectedApplicant.interviewDetails?.location && (
                  <button
                    onClick={handleSaveInterviewDetails}
                    disabled={loading || !interviewDetails.location || !interviewDate || !interviewTime}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" />
                    Save Interview Details
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Custom styling overrides for react-datepicker — matches app's blue/purple theme */}
      <style>{`
        .interview-datepicker .react-datepicker-wrapper {
          width: 100%;
        }
        .interview-datepicker .react-datepicker__input-container input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }
        .interview-datepicker .react-datepicker__input-container input:disabled {
          cursor: not-allowed;
        }
        .interview-datepicker .react-datepicker-popper {
          z-index: 60;
        }
        .interview-datepicker .react-datepicker {
          font-family: inherit;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .interview-datepicker .react-datepicker__header {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          border-bottom: none;
          padding-top: 0.75rem;
        }
        .interview-datepicker .react-datepicker__current-month,
        .interview-datepicker .react-datepicker-time__header {
          color: #ffffff;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .interview-datepicker .react-datepicker__day-name {
          color: #e0e7ff;
          font-weight: 500;
        }
        .interview-datepicker .react-datepicker__navigation-icon::before {
          border-color: #ffffff;
        }
        .interview-datepicker .react-datepicker__day {
          border-radius: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        .interview-datepicker .react-datepicker__day:hover {
          background-color: #dbeafe;
          color: #2563eb;
        }
        .interview-datepicker .react-datepicker__day--selected,
        .interview-datepicker .react-datepicker__day--keyboard-selected {
          background: linear-gradient(to right, #2563eb, #7c3aed);
          color: #ffffff;
        }
        .interview-datepicker .react-datepicker__day--today {
          font-weight: 700;
          color: #2563eb;
        }
        .interview-datepicker .react-datepicker__day--disabled {
          color: #d1d5db;
        }
        .interview-datepicker .react-datepicker__time-container {
          border-left: 1px solid #e5e7eb;
        }
        .interview-datepicker .react-datepicker__time-list-item {
          font-size: 0.8125rem;
          font-weight: 500;
          color: #374151;
        }
        .interview-datepicker .react-datepicker__time-list-item:hover {
          background-color: #dbeafe !important;
          color: #2563eb;
        }
        .interview-datepicker .react-datepicker__time-list-item--selected {
          background: linear-gradient(to right, #2563eb, #7c3aed) !important;
          color: #ffffff !important;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ApplicantProfilePreview;