import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { FiTrendingUp, FiAward, FiBarChart2, FiStar } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl text-sm">
        <p className="font-bold text-indigo-300">{label}</p>
        <p className="mt-1">Score: <b>{payload[0].value}</b></p>
      </div>
    );
  }
  return null;
};

export default function Progress() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [progressRes, analyticsRes] = await Promise.all([
          API.get("/analytics/progress"),
          API.get("/analytics"),
        ]);

        const prog = progressRes.data.data;
        if (prog && prog.history) {
          setHistory(
            prog.history.map(h => ({
              date: formatDate(h.created_at),
              score: Math.round(h.score),
            }))
          );
          setStats(prog);
        }

        const analytics = analyticsRes.data.data;
        if (analytics && analytics.skillLevels) {
          const mapped = Object.entries(analytics.skillLevels).map(([name, val]) => ({
            name,
            score: Math.round(val.score),
            level: val.level,
          })).sort((a, b) => b.score - a.score);
          setSkills(mapped);
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const levelColor = (level) => {
    if (level === "STRONG") return { bar: "bg-emerald-500", text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" };
    if (level === "MEDIUM") return { bar: "bg-yellow-400", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700" };
    return { bar: "bg-red-400", text: "text-red-600", badge: "bg-red-100 text-red-700" };
  };

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl mb-6 shadow-lg">
          <h1 className="text-2xl font-extrabold flex items-center gap-3">
            <FiTrendingUp size={24} /> Progress Timeline
          </h1>
          <p className="text-purple-100 mt-1 text-sm">Track your skill growth over time. Every point of improvement counts.</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Starting Score", value: Math.round(stats.firstScore || 0), icon: FiStar, color: "text-blue-600 bg-blue-50" },
              { label: "Latest Score",   value: Math.round(stats.latestScore || 0), icon: FiAward, color: "text-indigo-600 bg-indigo-50" },
              { label: "Total Growth",   value: `${stats.growth >= 0 ? "+" : ""}${Math.round(stats.growth || 0)}`, icon: FiTrendingUp, color: stats.growth >= 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50" },
              { label: "Trend",          value: stats.trend || "—", icon: FiBarChart2, color: "text-purple-600 bg-purple-50" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Score History Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-500" /> Score History
          </h3>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-gray-400 animate-pulse">Loading chart...</div>
          ) : history.length < 2 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400">
              <FiTrendingUp size={36} className="mb-3 text-gray-300" />
              <p className="font-semibold">Not enough data yet</p>
              <p className="text-sm mt-1">Add or update skills to build your progress history.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={history} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ r: 4, fill: "#6366f1" }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Per-Skill Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
            <FiBarChart2 className="text-purple-500" /> Skill Breakdown
          </h3>
          {skills.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No skills added yet. <a href="/add-skill" className="text-indigo-600 font-semibold">Add your first skill →</a></p>
          ) : (
            <div className="space-y-4">
              {skills.map((skill) => {
                const colors = levelColor(skill.level);
                return (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{skill.level}</span>
                        <span className={`text-sm font-extrabold ${colors.text}`}>{skill.score}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${colors.bar}`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
