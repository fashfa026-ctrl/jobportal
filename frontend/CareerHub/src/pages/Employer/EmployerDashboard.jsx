import { useEffect, useState } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

// FIXED IMPORTS WITH ACCURATE RELATIVE PATHS
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../../components/layout/DashboardLayout";
import JobDashboardCard from "../../components/Cards/JobDashboardCard";
import ApplicantDashboardCard from "../../components/Cards/ApplicantDashboardCard";
import LoadingSpinner from "../../components/layout/LoadingSpinner"; // Imported your custom component

const Card =({title, headerAction, subtitle, className, children})=>{
  return <div
  className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
  >
  {(title || headerAction) && (
  <div className="flex items-center justify-between p-6 pb-4">
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
    {headerAction}
  </div>
)}
   <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
   </div>
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-violet-500 to-violet-600",
    //orange: "from-orange-5000 to-orange-600",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
  <div>
    <p className="text-white/80 text-sm font-medium">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
    {trend && (
      <div className="flex items-center mt-2 text-sm">
        <TrendingUp className="h-4 w-4 mr-1" />
        <span className="font-medium"></span>
      </div>
    )}
  </div>
  <div className="bg-white/10 p-3 rounded-xl">
    <Icon className="h-6 w-6" />
  </div>
</div>
    </Card>
  );
};

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Error fetching dashboard overview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => {};
  }, []);

  // FIXED CONDITION: If loading is true, instantly yield the loading viewport view
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
  <DashboardLayout activeMenu="employer-dashboard">
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Active Jobs"
            value={dashboardData?.counts?.totalActiveJobs || 0}
            icon={Briefcase}
            trend={true}
            trendValue={`${dashboardData?.trends?.activeJobs || 0}%`}
            color="blue"
          />

        <StatCard
  title="Total Applicants"
  value={dashboardData?.counts?.totalApplications || 0}
  icon={Users}
  trend={true}
  /*trendValue={`${
    dashboardData?.counts?.trends?.totalApplicants || 0
  }%`}*/
  color="green"
/>

<StatCard
  title="Accepted Candidates"
  value={dashboardData?.counts?.totalAccepted || dashboardData?.counts?.totalHired || 0}
  icon={CheckCircle2}
  trend={true}
 /* trendValue={`${dashboardData?.counts?.acceptedCandidates || dashboardData?.counts?.trends?.totalHired || 0}%`} */
  color="purple"
/>

        </div>

      {/* Recent Activity */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <Card
    title="Recent Job Posts"
    subtitle="Your latest job postings"
    headerAction={
      <button
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        onClick={() => navigate("/manage-jobs")}
      >
        View all
      </button>
    }
  >
    <div className="space-y-3">
      {dashboardData?.data?.recentJobs
        ?.slice(0, 3)
        ?.map((job, index) => (
          <JobDashboardCard key={index} job={job} />
        ))}
    </div>
  </Card>

        <Card
  title="Recent Applications"
  subtitle="Latest candidate applications"
  headerAction={
    <button
      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      onClick={() => navigate("/manage-jobs")}
    >
      View all
    </button>
  }
>
  <div className="space-y-3">
    {dashboardData?.data?.recentApplications
      ?.slice(0, 3)
      ?.map((data, index) => (
        <ApplicantDashboardCard
          key={index}
          application={data?.applicant}
          position={data?.job?.title || ""}
          time={moment(data?.updatedAt).fromNow()}
        />
      ))}
  </div>
</Card>

</div>

      {/* Quick Actions */}
<Card
  title="Quick Actions"
  subtitle="Common tasks to get you started"
>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[
      {
        title: "Post New Job",
        icon: Plus,
        color: "bg-blue-50 text-blue-700",
        path: "/post-job",
      },
      {
        title: "Review Applications",
        icon: Users,
        color: "bg-green-50 text-green-700",
        path: "/manage-jobs",
      },
      {
        title: "Company Settings",
        icon: Building2,
        color: "bg-orange-50 text-orange-700",
        path: "/company-profile",
      },
    ].map((action, index) => (
      <button
        key={index}
        className="flex items-center space-x-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-500/20 bg-gray-50/50 hover:bg-white dark:hover:bg-slate-900/50 hover:shadow-lg hover:shadow-slate-100 dark:hover:shadow-none transition-all duration-300 group cursor-pointer text-left"
        onClick={() => navigate(action.path)}
      >
          <div className={`p-2.5 rounded-xl ${action.color} group-hover:scale-110 transition-transform duration-300`}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="font-bold text-sm text-gray-700 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {action.title}
          </span>
      </button>
    ))}
  </div>
</Card>

      </div>
    )}
  </DashboardLayout>
);
};
export default EmployerDashboard;