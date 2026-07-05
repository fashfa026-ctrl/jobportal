import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, CheckCircle, CalendarClock } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
    const [backendStats, setBackendStats] = useState({
        applications: 0,
        viewToApplyRate: 0,
        acceptanceRate: 0,
        todaysApplications: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/stats");
                setBackendStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    // ✅ Single accent color per metric, all drawn from the design system
    // (primary = volume metric, success = positive rate, warning = needs-attention rate)
    // ✅ Premium accent gradients and trend data for a high-end dashboard feel
    const stats = [
        {
            icon: FileText,
            title: 'Total Applications',
            value: `${backendStats.applications}+`,
            bg: 'bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/50',
            text: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-600 to-violet-600',
            borderClass: 'border-l-indigo-500',
            shadowClass: 'shadow-[0_8px_30px_rgba(99,102,241,0.06)]',
            hoverClass: 'hover:border-indigo-450 hover:shadow-[0_20px_40px_rgba(99,102,241,0.1)]',
            
        },
        {
            icon: Eye,
            title: 'View-to-Apply Rate',
            value: `${backendStats.viewToApplyRate}%`,
            bg: 'bg-violet-50/80 dark:bg-violet-950/30 border border-violet-100/50 dark:border-violet-900/50',
            text: 'text-violet-600 dark:text-violet-400',
            gradient: 'from-violet-600 to-fuchsia-600',
            borderClass: 'border-l-violet-500',
            shadowClass: 'shadow-[0_8px_30px_rgba(139,92,246,0.06)]',
            hoverClass: 'hover:border-violet-450 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]',
            
        },
        {
            icon: CheckCircle,
            title: 'Acceptance Rate',
            value: `${backendStats.acceptanceRate}%`,
            bg: 'bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/50',
            text: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-600 to-teal-600',
            borderClass: 'border-l-emerald-500',
            shadowClass: 'shadow-[0_8px_30px_rgba(16,185,129,0.06)]',
            hoverClass: 'hover:border-emerald-450 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)]',
            
        },
        {
            icon: CalendarClock,
            title: "Today's Applications",
            value: `${backendStats.todaysApplications}`,
            bg: 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/50',
            text: 'text-amber-600 dark:text-amber-400',
            gradient: 'from-amber-500 to-orange-600',
            borderClass: 'border-l-amber-500',
            shadowClass: 'shadow-[0_8px_30px_rgba(245,158,11,0.06)]',
            hoverClass: 'hover:border-amber-450 hover:shadow-[0_20px_40px_rgba(245,158,11,0.1)]',
            
        },
    ];

    return (
        <section className="py-24 bg-slate-50/40 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
            {/* Elegant Tech Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Glowing Decorative Blobs */}
            <div className="absolute top-10 left-1/4 w-72 h-72 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                        Platform Stats
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 mb-6 tracking-tight">
                        Platform
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> Analytics </span>
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Real-time insights and data-driven results that showcase the power of our platform in connecting talent with opportunities.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 border-l-4 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[180px] ${stat.borderClass} ${stat.shadowClass} ${stat.hoverClass}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                            <stat.icon className={`w-5 h-5 ${stat.text}`} />
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 px-2.5 py-0.5 rounded-full">
                                            {stat.trend}
                                        </span>
                                    </div>

                                    <h3 className={`text-3xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                                        {stat.value}
                                    </h3>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm tracking-tight">{stat.title}</p>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

export default Analytics;