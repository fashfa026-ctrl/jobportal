import { motion } from 'framer-motion';
import { Search, ArrowRight, Users, Building2, TrendingUp, UserCheck, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from 'react';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Turns a createdAt timestamp into "Just now" / "3h ago" / "2d ago"
// createdAt-ஐ "Just now" / "3h ago" போன்ற Text-ஆ மாத்தும்
const timeAgo = (dateString) => {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

// Rs. Format-ல Salary காட்டும் (உங்க JobCard.jsx-ல இருக்குற Style-ஐயே Follow பண்றோம்)
const formatSalary = (job) => {
  if (!job || (!job.salaryMin && !job.salaryMax)) return "Salary not disclosed";
  const formatNumber = (num) => {
    const n = Number(num);
    return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : `${n}`;
  };
  const min = job.salaryMin ? formatNumber(job.salaryMin) : "";
  const max = job.salaryMax ? formatNumber(job.salaryMax) : "";
  return min && max ? `Rs. ${min} - Rs. ${max}` : `Rs. ${min || max}`;
};

// Real-data floating dashboard components for the right-hand column (whitespace solution)
// [UPDATED] All 3 cards now pull live data from the backend instead of hardcoded demo text.
const DashboardMockup = ({ latestJob, jobsLoading }) => {
  return (
    <div className="relative w-full max-w-[480px] aspect-[4/3.5] mx-auto rounded-3xl bg-gradient-to-tr from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 border border-blue-500/10 dark:border-blue-500/5 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
      {/* Decorative Glowing Orbs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl" />

      {/* Card 1: Latest Real Job Posting (from GET /api/jobs) */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-lg w-[260px] md:w-[280px] self-start z-10 cursor-pointer"
      >
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            CH
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
              {jobsLoading ? "Loading..." : (latestJob?.title || "No jobs posted yet")}
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
              {latestJob ? `${latestJob.location || "—"} / ${latestJob.type || "—"}` : "Check back soon"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-slate-800/80">
          <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full">
            {latestJob ? formatSalary(latestJob) : "—"}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500">
            {latestJob ? timeAgo(latestJob.createdAt) : ""}
          </span>
        </div>
      </motion.div>

      {/* Card 2: [FIXED - no more duplicate with Analytics section] 
          Shows how many people applied to the SAME latest job as Card 1 (per-job data, not site-wide) */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-lg w-[230px] md:w-[250px] self-end z-10 cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">
              {latestJob ? `${latestJob.applicationCount || 0} Applicants` : "—"}
            </h4>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">Already applied to this role</p>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Real "applications sent today" count (from GET /api/stats) — replaces the fake success toast */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-gray-100 dark:border-slate-800/80 px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-3 w-[220px] mx-auto mt-2 z-10 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center flex-shrink-0">
          <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-900 dark:text-white">
            {latestJob ? `${latestJob.views || 0} Views` : "—"}
          </p>
          <p className="text-[9px] text-gray-400 dark:text-slate-500">People checking this job out</p>
        </div>
      </motion.div>
    </div>
  );
};

// Tech Company Logos (for Trust building &Whitespace Fill)
// [FIXED] Real company names — no more hardcoded Google/Microsoft/Meta/Stripe.
// Comes from actual employers who have posted at least one job (see Hero's fetchTopCompanies).
const CompanyLogos = ({ companies }) => {
  if (!companies || companies.length === 0) return null; // hide section if no employers yet

  return (
    <div className="pt-10 mt-12 border-t border-gray-100 dark:border-slate-800/80">
      <p className="text-left text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-6">
        Top companies hiring right now
      </p>
      <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
        {companies.map((name, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer"
          >
            <span className="font-semibold tracking-wide text-sm">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Hero = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { icon: Users,      label: 'Active Users', value: '...' },
    { icon: Building2,  label: 'Companies',    value: '...' },
    { icon: TrendingUp, label: 'Jobs Posted',  value: '...' }
  ]);

  
  // [ADDED] Latest real job posting, for Card 1 of the mockup
  const [latestJob, setLatestJob] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [topCompanies, setTopCompanies] = useState([]); // [ADDED]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/api/stats");
        setStats([
          { icon: Users,      label: 'Active Users', value: res.data.users + '+' },
          { icon: Building2,  label: 'Companies',    value: res.data.companies + '+' },
          { icon: TrendingUp, label: 'Jobs Posted',  value: res.data.jobs + '+' }
        ]);
        
      } catch (err) {
        console.error('Stats fetch error:', err);
      }
    };

    // [ADDED] Fetch all open jobs (public route) and pick the most recently posted one
    const fetchLatestJob = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.JOBS.GET_ALL_JOBS);
        const jobs = res.data || [];
        const sorted = [...jobs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLatestJob(sorted[0] || null);

        // [ADDED] Build unique list of real company names from the same jobs data
        const names = jobs
          .map((j) => j.company?.companyName)
          .filter(Boolean); // remove empty/undefined
        const uniqueNames = [...new Set(names)].slice(0, 6); // max 6 shown
        setTopCompanies(uniqueNames);
      } catch (err) {
        console.error('Latest job fetch error:', err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchStats();
    fetchLatestJob();
  }, []);

  return (
    <section className="pt-28 pb-16 bg-white dark:bg-slate-950 min-h-screen flex items-center transition-colors duration-200 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-[1.1]"
            >
              Find Your Dream Job or
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Perfect Hire
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-600 dark:text-slate-400 mb-8 leading-relaxed max-w-xl"
            >
              Connect talented professionals with innovative companies.
              Your next career move or perfect candidate is just one click away.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                onClick={() => navigate("/find-jobs")}
              >
                <Search className="w-5 h-5" />
                <span>Find Jobs</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm cursor-pointer"
                onClick={() => navigate(
                  isAuthenticated && user?.role === "employer"
                    ? "/employer/dashboard"
                    : "/login"
                )}
              >
                Post a Job
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 md:gap-8 max-w-lg"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-1.5"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/40 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-semibold tracking-wide uppercase">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Top Hiring Companies */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <CompanyLogos companies={topCompanies} />
            </motion.div>
          </div>

          {/* Right Column (Visual Dashboard Mockup - whitespace solution) */}
          <div className="lg:col-span-5 hidden lg:block relative">
          <DashboardMockup latestJob={latestJob} jobsLoading={jobsLoading} />          </div>

        </div>
      </div>

      {/* Background Decorative Blur Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/30 dark:bg-blue-950/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/30 dark:bg-purple-950/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Hero;