import { useEffect, useState } from "react";
import API from "../services/api";
import { FiCheckCircle, FiAlertCircle, FiTrendingUp, FiZap, FiTarget, FiInfo } from "react-icons/fi";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

const levelConfig = {
  SUCCESS: { icon: FiCheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30", border: "border-emerald-200 dark:border-emerald-800" },
  WARNING: { icon: FiAlertCircle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/30", border: "border-yellow-200 dark:border-yellow-800" },
  INFO:    { icon: FiInfo,         color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/30", border: "border-indigo-200 dark:border-indigo-800" },
  default: { icon: FiTrendingUp,   color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30", border: "border-purple-200 dark:border-purple-800" },
};

export default function Recommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get("/recommendations");
        const list = res?.data?.data?.recommendations || [];
        setData(list);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Analyzing your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">✨ AI Recommendations</h2>
          <p className="text-purple-200 text-base font-medium opacity-90 max-w-2xl">
            Personalized, actionable steps derived from your learning trajectory and skill levels.
          </p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <button onClick={() => navigate("/quiz")} className="bg-white/15 hover:bg-white/25 transition px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5">
              <FiZap size={13} /> Take Skill Quiz
            </button>
            <button onClick={() => navigate("/interview")} className="bg-white/15 hover:bg-white/25 transition px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5">
              <FiTarget size={13} /> Mock Interview
            </button>
          </div>
        </div>

        {/* Cards */}
        {data.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 text-center shadow-sm">
            <FiCheckCircle className="text-5xl text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">You're on track!</h3>
            <p className="text-gray-500 dark:text-gray-400">Add more skills to generate personalized insights.</p>
            <button onClick={() => navigate("/add-skill")} className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition">
              Add a Skill
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {data.map((rec, index) => {
              const cfg = levelConfig[rec.level] || levelConfig.default;
              const Icon = cfg.icon;
              const isString = typeof rec === "string";
              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${cfg.bg} ${cfg.border}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className={cfg.color} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-xs font-black uppercase tracking-widest ${cfg.color}`}>
                          {isString ? "Recommendation" : (rec.skill || "Insight")}
                        </p>
                        {rec.score != null && (
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
                            {rec.score}% match
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 dark:text-gray-100 font-semibold leading-relaxed">
                        {isString ? rec : (rec.message || rec.task)}
                      </p>
                      {!isString && rec.action && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-400 dark:bg-gray-500" />
                          {rec.action}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-black text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}