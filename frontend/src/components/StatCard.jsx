import { useEffect, useRef } from "react";

export default function StatCard({ title, value, icon: Icon, subtitle, color = "indigo", trend }) {
  const colorMap = {
    indigo:  { bg: "bg-indigo-50 dark:bg-indigo-900/30",  icon: "text-indigo-600 dark:text-indigo-400",  ring: "ring-indigo-100 dark:ring-indigo-900" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-100 dark:ring-emerald-900" },
    purple:  { bg: "bg-purple-50 dark:bg-purple-900/30",   icon: "text-purple-600 dark:text-purple-400",   ring: "ring-purple-100 dark:ring-purple-900" },
    amber:   { bg: "bg-amber-50 dark:bg-amber-900/30",     icon: "text-amber-600 dark:text-amber-400",     ring: "ring-amber-100 dark:ring-amber-900" },
    rose:    { bg: "bg-rose-50 dark:bg-rose-900/30",       icon: "text-rose-600 dark:text-rose-400",       ring: "ring-rose-100 dark:ring-rose-900" },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ring-4 ${c.bg} ${c.ring}`}>
            <Icon className={c.icon} size={20} />
          </div>
        )}
        {trend !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"}`}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">{value}</h2>
      {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-medium">{subtitle}</p>}
    </div>
  );
}
