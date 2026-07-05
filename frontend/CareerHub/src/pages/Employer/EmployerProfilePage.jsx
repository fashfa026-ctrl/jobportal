import { useState, useEffect } from "react";
import { Building2, Mail, Edit3, X, Save, MapPin, Globe, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../pages/utils/axiosInstance";
import { API_PATHS } from "../../pages/utils/apiPaths";
import toast from "react-hot-toast";
import DashboardLayout from '../../components/layout/DashboardLayout';

const EmployerProfilePage = () => {
  const { user, updateUser } = useAuth();

  const getUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http") || url.startsWith("blob:")) return url;
    return `http://localhost:8000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
    companyLocation: user?.companyLocation || "",
    companyWebsite: user?.companyWebsite || "",
    companyPhone: user?.companyPhone || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [avatarFile, setAvatarFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(getUrl(user?.avatar));
  const [logoPreview, setLogoPreview] = useState(getUrl(user?.companyLogo));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.avatar) setAvatarPreview(getUrl(user.avatar));
    if (user?.companyLogo) setLogoPreview(getUrl(user.companyLogo));
    if (user) {
      const data = {
        fullName: user.fullName || "",
        email: user.email || "",
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
        companyLocation: user.companyLocation || "",
        companyWebsite: user.companyWebsite || "",
        companyPhone: user.companyPhone || "",
      };
      setProfileData(data);
      setFormData(data);
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("companyName", formData.companyName);
      data.append("companyDescription", formData.companyDescription);
      data.append("companyLocation", formData.companyLocation);
      data.append("companyWebsite", formData.companyWebsite);
      data.append("companyPhone", formData.companyPhone);
      if (avatarFile) data.append("avatar", avatarFile);
      if (logoFile) data.append("companyLogo", logoFile);

      const response = await axiosInstance.put(
        API_PATHS.USERS.UPDATE_PROFILE,
        data
      );

      const updatedUser = response.data.user || response.data;

      updateUser({
        ...user,
        fullName: updatedUser.fullName,
        companyName: updatedUser.companyName,
        companyDescription: updatedUser.companyDescription,
        companyLocation: updatedUser.companyLocation,
        companyWebsite: updatedUser.companyWebsite,
        companyPhone: updatedUser.companyPhone,
        avatar: updatedUser.avatar,
        companyLogo: updatedUser.companyLogo,
      });

      const updated = {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        companyName: updatedUser.companyName,
        companyDescription: updatedUser.companyDescription,
        companyLogo: updatedUser.companyLogo,
        companyLocation: updatedUser.companyLocation,
        companyWebsite: updatedUser.companyWebsite,
        companyPhone: updatedUser.companyPhone,
      };

      setProfileData(updated);
      setAvatarPreview(getUrl(updatedUser.avatar));
      setLogoPreview(getUrl(updatedUser.companyLogo));
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setAvatarPreview(getUrl(profileData.avatar));
    setLogoPreview(getUrl(profileData.companyLogo));
    setAvatarFile(null);
    setLogoFile(null);
    setEditMode(false);
  };

  return (
    <DashboardLayout activeMenu='company-profile'>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950/20 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-650 px-8 py-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Employer Profile</h1>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all cursor-pointer text-sm font-semibold"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Profile Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
                    Personal Information
                  </h2>

                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center border-4 border-blue-50">
                          <span className="text-white text-2xl font-bold">
                            {user?.fullName?.charAt(0).toUpperCase() || "E"}
                          </span>
                        </div>
                      )}
                      {editMode && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition">
                          <Edit3 className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      )}
                    </div>
                    <div>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange("fullName", e.target.value)}
                          className="text-base font-semibold text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      ) : (
                        <h3 className="text-base font-semibold text-gray-800">
                          {profileData.fullName}
                        </h3>
                      )}
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-6">
                  <h2 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
                    Company Information
                  </h2>

                  {/* Logo + Name */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Company Logo"
                          className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      {editMode && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition">
                          <Edit3 className="w-3 h-3" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                      )}
                    </div>
                    <div className="flex-1">
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          placeholder="Company Name"
                          className="w-full text-base font-semibold text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      ) : (
                        <h3 className="text-base font-semibold text-gray-800">
                          {profileData.companyName || "No company name"}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Company Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Company Description
                    </label>
                    {editMode ? (
                      <textarea
                        value={formData.companyDescription}
                        onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                        rows={3}
                        placeholder="Describe your company..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">
                        {profileData.companyDescription || "No description added"}
                      </p>
                    )}
                  </div>

                  {/* Company Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> Location
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.companyLocation}
                        onChange={(e) => handleInputChange("companyLocation", e.target.value)}
                        placeholder="e.g. Colombo, Sri Lanka"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">
                        {profileData.companyLocation || "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <Globe className="w-4 h-4" /> Website
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.companyWebsite}
                        onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                        placeholder="e.g. https://company.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      <p className="text-sm text-blue-600">
                        {profileData.companyWebsite ? (
                          <a href={profileData.companyWebsite} target="_blank" rel="noreferrer" className="hover:underline">
                            {profileData.companyWebsite}
                          </a>
                        ) : "Not specified"}
                      </p>
                    )}
                  </div>

                  {/* Company Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" /> Phone
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={formData.companyPhone}
                        onChange={(e) => handleInputChange("companyPhone", e.target.value)}
                        placeholder="e.g. +94 77 123 4567"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">
                        {profileData.companyPhone || "Not specified"}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Save / Cancel Buttons */}
              {editMode && (
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfilePage;
