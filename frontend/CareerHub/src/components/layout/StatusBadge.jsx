import React from 'react'

const StatusBadge = ({ status }) => {
  // ✅ Uses the new CareerHub design tokens (success/danger/warning) instead of
  // ad-hoc gray/yellow/green/red — consistent with index.css color system
  const statusConfig = {
    applied: "bg-slate-100 text-slate-700",
    "in review": "bg-amber-50 text-amber-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
        statusConfig[status?.toLowerCase()] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status || "applied"}
    </span>
  );
};

export default StatusBadge;