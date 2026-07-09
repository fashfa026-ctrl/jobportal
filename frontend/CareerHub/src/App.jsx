import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";

import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/Employer/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminEmployers from "./pages/Admin/AdminEmployers";
import AdminJobs from "./pages/Admin/AdminJobs";
import AdminApplications from "./pages/Admin/AdminApplications";
import AdminReports from "./pages/Admin/AdminReports";
import AdminFeedback from "./pages/Admin/AdminFeedback";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/job/:jobId" element={<JobDetails />} />

          {/* Job Seeker Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="jobseeker" />}>
            <Route path="/find-jobs" element={<JobSeekerDashboard />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Employer Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="employer" />}>
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/post-job" element={<JobPostingForm />} />
            <Route path="/edit-job/:jobId" element={<JobPostingForm />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/applicants" element={<ApplicationViewer />} />
            <Route path="/employer-profile" element={<EmployerProfilePage />} />
            <Route path="/company-profile" element={<Navigate to="/employer-profile" replace />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/employers" element={<AdminEmployers />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster toastOptions={{ style: { fontSize: "13px" } }} />
    </AuthProvider>
  );
};

export default App;