import { useState, useEffect } from "react";
import { getRoadmap, downloadCalendar } from "../services/roadmap";
import { FiMap, FiDownload, FiCheckCircle, FiLoader, FiCircle, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import Layout from "../components/Layout";
import toast from "react-hot-toast";

const STORAGE_KEY = (goal) => `roadmap_progress_${goal.toLowerCase().replace(/\s+/g, "_")}`;

function Roadmap() {
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [roadmapType, setRoadmapType] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [completed, setCompleted] = useState({}); // { dayIndex: true/false }
  const [activeGoal, setActiveGoal] = useState(""); // goal that the roadmap was generated for

  // Load saved progress when roadmap goal changes
  const loadProgress = (g) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY(g));
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  };

  // Persist progress on every toggle
  const toggleDay = (index) => {
    setCompleted(prev => {
      const next = { ...prev, [index]: !prev[index] };
      localStorage.setItem(STORAGE_KEY(activeGoal), JSON.stringify(next));
      return next;
    });
  };

  const fetchRoadmap = async () => {
    if (!goal.trim()) { toast.error("Please enter a goal"); return; }
    setLoading(true);
    try {
      const res = await getRoadmap({ goal, useAI });
      const result = res.data.data || res.data;
      const type = result.type;
      setRoadmapType(type);

      let parsed;
      if (type === "AI") {
        const lines = Array.isArray(result.roadmap)
          ? result.roadmap
          : result.roadmap.split("\n").filter((item) => item.trim());
        parsed = lines.map((line, i) => ({
          day: i + 1,
          task: typeof line === "string" ? line : line.task || String(line),
        }));
      } else {
        parsed = result.roadmap || [];
      }

      setRoadmap(parsed);
      setActiveGoal(goal);
      setCompleted(loadProgress(goal));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await downloadCalendar({ goal });
      const blob = new Blob([res.data], { type: "text/calendar" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "roadmap.ics";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download calendar");
    }
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY(activeGoal));
    setCompleted({});
    toast.success("Progress reset!");
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = roadmap.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Layout>
      <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-8 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
            <FiMap size={28} /> Smart Learning Roadmap
          </h1>
          <p className="text-indigo-200 text-base">Generate AI or adaptive roadmaps for any tech goal. Your progress is saved automatically.</p>
        </div>

        {/* Input card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-600 transition-all text-gray-800 dark:text-white font-medium placeholder-gray-400"
              placeholder="Enter your goal (e.g. Full Stack Developer, Learn Rust)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchRoadmap()}
              id="roadmap-goal-input"
            />
            <button
              className="md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              onClick={fetchRoadmap}
              disabled={loading}
              id="roadmap-generate-btn"
            >
              {loading ? <><FiLoader className="animate-spin" /> Generating...</> : "Generate Roadmap"}
            </button>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800 transition-colors w-fit">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500 cursor-pointer accent-indigo-600"
            />
            <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm flex items-center gap-2">
              ✨ Generate with AI (personalised to your skill level)
            </span>
          </label>
        </div>

        {/* Roadmap output */}
        {roadmap.length > 0 && (
          <div>
            {/* Progress bar */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-indigo-500" size={16} />
                  <span className="font-bold text-gray-800 dark:text-white text-sm">Your Progress</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-1 ${
                    roadmapType === "AI" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" :
                    roadmapType === "ADAPTIVE" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  }`}>
                    {roadmapType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{completedCount}/{totalCount}</span>
                  <span className="text-lg font-extrabold text-gray-800 dark:text-white">{progressPct}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition text-sm shadow-sm"
                  id="roadmap-download-btn"
                >
                  <FiDownload size={14} /> Calendar (.ics)
                </button>
                {completedCount > 0 && (
                  <button
                    onClick={resetProgress}
                    className="flex items-center gap-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-xl text-sm font-medium transition hover:bg-red-50 dark:hover:bg-red-900/20"
                    id="roadmap-reset-btn"
                  >
                    <FiRefreshCw size={14} /> Reset
                  </button>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900 ml-4 pb-4">
              {roadmap.map((r, i) => {
                const done = !!completed[i];
                return (
                  <div key={i} className="mb-5 relative pl-8 group">
                    {/* Timeline dot — clickable */}
                    <button
                      onClick={() => toggleDay(i)}
                      className={`absolute -left-[11px] top-3 w-5 h-5 rounded-full border-4 transition-all duration-200 hover:scale-125 focus:outline-none ${
                        done
                          ? "bg-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/30"
                          : "bg-white dark:bg-gray-900 border-indigo-300 dark:border-indigo-700"
                      }`}
                      title={done ? "Mark incomplete" : "Mark complete"}
                      id={`roadmap-day-${i + 1}`}
                    />

                    <div
                      className={`p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group-hover:shadow-md ${
                        done
                          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800"
                          : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700"
                      }`}
                      onClick={() => toggleDay(i)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-extrabold uppercase tracking-widest mb-1 block ${
                            done ? "text-indigo-500 dark:text-indigo-400" : "text-indigo-400 dark:text-indigo-500"
                          }`}>
                            Day {r.day || i + 1}{r.week ? ` · Week ${r.week}` : ""}
                          </span>
                          <p className={`font-semibold leading-relaxed transition-colors ${
                            done ? "text-indigo-700 dark:text-indigo-300 line-through decoration-indigo-300" : "text-gray-800 dark:text-gray-100"
                          }`}>
                            {r.task || r}
                          </p>
                        </div>
                        <div className={`flex-shrink-0 mt-0.5 transition-all duration-200 ${done ? "text-indigo-500" : "text-gray-300 dark:text-gray-600 group-hover:text-indigo-400"}`}>
                          {done ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {progressPct === 100 && (
                <div className="ml-8 mt-2 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-center animate-in fade-in duration-500">
                  <p className="text-2xl mb-1">🏆</p>
                  <p className="font-extrabold text-emerald-700 dark:text-emerald-300">Roadmap Complete!</p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">You finished the entire learning path. Generate a new one to keep growing!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Roadmap;