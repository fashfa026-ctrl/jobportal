import { Save, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const EditProfileDetails = ({
  formData,
  handleImageChange,
  handleInputChange,
  handleSave,
  handleCancel,
  saving,
  uploading,
}) => {
  return (
    <DashboardLayout activeMenu="company-profile">
      {formData && (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950/20 py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-lg overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-650 px-8 py-6 flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">Edit Profile</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all disabled:opacity-50 text-sm cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || uploading.avatar || uploading.logo}
                    className="bg-white dark:bg-blue-600 text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-700 px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-all font-semibold text-sm shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              <div className="p-8 space-y-8">
                
                {/* Personal Information */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-6">
                    Personal Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Profile Avatar Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "avatar")}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {uploading.avatar && (
                        <p className="text-xs text-blue-600 mt-1 animate-pulse">Uploading profile picture...</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2 mb-6">
                    Company Details
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyName || ""}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="Enter company name"
                        />
                      </div>

                      {/* Company Logo Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Logo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, "logo")}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {uploading.logo && (
                          <p className="text-xs text-blue-600 mt-1 animate-pulse">Uploading logo...</p>
                        )}
                      </div>
                    </div>

                    {/* Company Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Description
                      </label>
                      <textarea
                        rows="4"
                        value={formData.companyDescription || ""}
                        onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Tell candidates about your company..."
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditProfileDetails;