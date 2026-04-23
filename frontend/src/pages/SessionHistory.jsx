import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { FiClock, FiCalendar, FiTrendingUp, FiZap } from "react-icons/fi";

function formatDuration(minutes) {
  if (!minutes || minutes === 0) return "—";
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit"
  });
}

export default function SessionHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSessions: 0, totalMinutes: 0, avgMinutes: 0 });

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await API.get("/session/history");
        const data = res.data.data || [];
        setSessions(data);

        // Compute stats
        const completed = data.filter(s => s.duration);
        const totalMinutes = completed.reduce((sum, s) => sum + (parseInt(s.duration) || 0), 0);
        setStats({
          totalSessions: data.length,
          totalMinutes,
          avgMinutes: completed.length ? Math.round(totalMinutes / completed.length) : 0,
        });
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  // Build heatmap: last 30 days
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0];
    const count = sessions.filter(s => s.start_time?.startsWith(key)).length;
    return { date: key, count, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });

  const maxCount = Math.max(...heatmapDays.map(d => d.count), 1);

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl mb-6 shadow-lg">
          <h1 className="text-2xl font-extrabold flex items-center gap-3">
            <FiClock size={24} /> Session History
          </h1>
          <p className="text-indigo-100 mt-1 text-sm">Your complete focus session log and activity heatmap.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Sessions", value: stats.totalSessions, icon: FiCalendar, color: "text-indigo-600 bg-indigo-50" },
            { label: "Total Focus Time", value: formatDuration(stats.totalMinutes), icon: FiClock, color: "text-purple-600 bg-purple-50" },
            { label: "Avg. Session", value: formatDuration(stats.avgMinutes), icon: FiTrendingUp, color: "text-emerald-600 bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Heatmap */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FiZap className="text-yellow-500" /> 30-Day Activity
          </h3>
          <div className="flex gap-1 flex-wrap">
            {heatmapDays.map((day) => {
              const intensity = day.count === 0 ? 0 : Math.ceil((day.count / maxCount) * 4);
              const colors = [
                "bg-gray-100 dark:bg-gray-700",
                "bg-indigo-100 dark:bg-indigo-900",
                "bg-indigo-300 dark:bg-indigo-700",
                "bg-indigo-500",
                "bg-indigo-700",
              ];
              return (
                <div
                  key={day.date}
                  title={`${day.label}: ${day.count} session${day.count !== 1 ? "s" : ""}`}
                  className={`w-6 h-6 rounded-md cursor-pointer transition-transform hover:scale-125 ${colors[intensity]}`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-gray-400">Less</span>
            {["bg-gray-100", "bg-indigo-100", "bg-indigo-300", "bg-indigo-500", "bg-indigo-700"].map((c, i) => (
              <span key={i} className={`w-4 h-4 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-gray-400">More</span>
          </div>
        </div>

        {/* Session List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-white">All Sessions</h3>
          </div>
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="p-10 text-center">
              <FiClock className="mx-auto text-gray-300 mb-3" size={36} />
              <p className="text-gray-500 font-medium">No sessions yet</p>
              <p className="text-sm text-gray-400 mt-1">Complete a Focus Mode session to see it here.</p>
              <a href="/focus" className="mt-4 inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition">
                Start Focus Session
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {sessions.map((session, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${session.duration ? "bg-green-400" : "bg-yellow-400 animate-pulse"}`} />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                        {formatDate(session.start_time)}
                      </p>
                      <p className="text-xs text-gray-400">Started at {formatTime(session.start_time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Duration</p>
                      <p className="font-bold text-gray-800 dark:text-gray-100">{formatDuration(session.duration)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.duration ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {session.duration ? "Completed" : "In Progress"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
