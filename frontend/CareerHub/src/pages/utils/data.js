import {
    Search,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Shield,
    Clock,
    Award,
    Briefcase,
    Building2,
    LayoutDashboard,
    Plus
} from "lucide-react";

export const jobSeekerFeatures = [
    {
        icon: Search,
        title: "Smart Job Matching",
        description:
        "AI-powered algorithm matches you with relevant opportunities based on your skills and preferences."
    },
    {
        icon: FileText,
        title: "Resume Builder",
        description: "Create professional resumes with our intuitive builder and templates designed by experts."
    },
    {
        icon: MessageSquare,
        title: "Direct Communication",
        description: "Connect directly with hiring managers and recruiters through our secure  messageing platform."
    },
    {
        icon: Award,
        title: "Skill Assessment",
        description: "Showcase your abilities with verified skill tests and earn badges that employers trust."
    },
];

export const employerFeatures = [
    {
        icon: Users,
        title: "Talent Pool Access",
        description: "Access our vast database of pre-screened candidates and find the perfect fit for your team."
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Track your hiring performance with detailed analytics and insights on candidate engagement."
    },
    {
        icon: Shield,
        title: "Verified Candidates",
        description: "All candidates undergo background verification to ensure you're hiring trustworthly professionals."
    },
    {
        icon: Clock,
        title: "Quick Hiring",
        description: "Streamlined hiring process reduces time-to-hire by 60% with automated screening tools."
    },
];

//Navigation items configuration
export const CATEGORIES = [
    {value: "Engineering", label: "Engineering" },
    {value: "Design", label: "Design" },
    {value: "Marketing", label: "Marketing" },
    {value: "Sales", label: "Sales" },
    {value: "IT & Software", label: "IT & Software" },
    {value: "Product", label: "Proudct" },
    {value: "Operations", label: "Operations" },
    {value: "Finance", label: "Finance" },
    {value: "HR", label: "HR" },
    {value: "Other", label: "Other" },
];

export const JOB_TYPES = [
    {value: "Remote", label: "Remote" },
    {value: "Full-Time", label: "Full-Time" },
    {value: "Part-Time", label: "Part-Time" },
    {value: "Contract", label: "Contract" },
    {value: "Internship", label: "Internship" },
];

export const SALARY_RANGES = [
    "Less than 30 000.00",
    "30 000.00 - 60 000.00",
    "More than 60 000.00",
];

export const NAVIGATION_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "post-job",
    label: "Post Job",
    path: "/post-job",
    icon: Plus,
  },
  {
    id: "jobs",
    label: "Manage Jobs",
    path: "/manage-jobs",
    icon: Briefcase,
  },
  {
    id: "profile",
    label: "Company Profile",
    path: "/company-profile",
    icon: Building2,
  },


];