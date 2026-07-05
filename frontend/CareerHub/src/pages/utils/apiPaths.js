export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  GET_PROFILE: "/api/auth/me",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_OTP: "/api/auth/verify-otp", // ✅ NEW
  RESET_PASSWORD: "/api/auth/reset-password", // ✅ CHANGED — no longer a function with token param
},

  USERS: {
    UPDATE_PROFILE: "/api/users/profile",
    DELETE_RESUME: "/api/users/resume/delete",
    GET_PUBLIC_PROFILE: (id) => `/api/users/public/${id}`,
  },

  DASHBOARD: {
    OVERVIEW: "/api/analytics/overview",
  },

  ADMIN: {
    DASHBOARD: "/api/admin/dashboard",
    USERS: "/api/admin/users",
    JOBS: "/api/admin/jobs",
    APPLICATIONS: "/api/admin/applications",
    USER_ROLE: (id) => `/api/admin/users/${id}/role`,
    DELETE_USER: (id) => `/api/admin/users/${id}`,
    DELETE_JOB: (id) => `/api/admin/jobs/${id}`,
    EMPLOYERS: "/api/admin/employers",
    TOGGLE_JOB: (id) => `/api/admin/jobs/${id}/toggle`,
    TOGGLE_BLOCK_USER: (id) => `/api/admin/users/${id}/block`, // ✅ NEW
  },

  JOBS: {
    DELETE: (id) => `/api/admin/jobs/${id}`,
    UPDATE: (id) => `/api/admin/jobs/${id}`,
    GET_ALL_JOBS: "/api/jobs",
    GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
    POST_JOB: "/api/jobs",
    GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-employer",
    UPDATE_JOB: (id) => `/api/jobs/${id}`,
    TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
    DELETE_JOB: (id) => `/api/jobs/${id}`,
    SAVE_JOB: (id) => `/api/saved-jobs/${id}`,
    UNSAVE_JOB: (id) => `/api/saved-jobs/${id}`,
    GET_SAVED_JOBS: "/api/saved-jobs/my",
  },

  APPLICATIONS: {
    APPLY_TO_JOB: (id) => `/api/applications/${id}`,
    GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
    GET_MY_APPLICATIONS: "/api/applications/my",
    GET_APPLICATION_BY_ID: (id) => `/api/applications/${id}`,
    UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};