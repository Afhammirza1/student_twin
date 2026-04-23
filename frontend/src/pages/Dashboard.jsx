import { useEffect, useState } from "react";
import API from "../services/api";
import { getUser } from "../services/auth";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SkillChart from "../components/SkillChart";
import {
  FiAward, FiStar, FiClock, FiActivity, FiTarget, FiCheckCircle,
  FiGithub, FiZap, FiTrendingUp, FiAlertTriangle, FiShare2,
  FiMic, FiCode
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summary, setSummary]         = useState(null);
  const [skills, setSkills]           = useState([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [syncing, setSyncing]         = useState(false);
  const [quest, setQuest]             = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [summaryRes, analyticsRes] = await Promise.all([
          API.get("/summary"),
          API.get("/analytics"),
        ]);
        setSummary(summaryRes.data.data);
        const formatted = Object.entries(
          analyticsRes.data.data.skillLevels || {}
        ).map(([name, val]) => ({ name, score: val.score }));
        setSkills(formatted);

        try {
          const qRes = await API.get("/gamification/quest");
          setQuest(qRes.data.data);
        } catch {}
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const handleGithubSync = async () => {
    if (!githubUsername.trim()) { toast.error("Enter a GitHub username"); return; }
    setSyncing(true);
    try {
      await API.post("/github/link", { username: githubUsername.trim() });
      const res = await API.post("/github/sync");
      toast.success(res.data?.message || "GitHub synced! 🐙");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to link GitHub");
    } finally { setSyncing(false); }
  };

  const handleCompleteQuest = async () => {
    try {
      const res = await API.post("/gamification/quest/complete");
      toast.success(res.data.data?.message || "Quest Completed! 🎉");
      setQuest(prev => ({ ...prev, completed: true }));
      setSummary(prev => ({ ...prev, xp: prev.xp + (res.data.data?.xpEarned || 20) }));
    } catch {
      toast.error("Quest already completed or failed.");
    }
  };

  const copyPortfolio = () => {
    const name = getUser()?.name || localStorage.getItem("userEmail")?.split("@")[0] || "user";
    navigator.clipboard.writeText(`${window.location.origin}/profile/${name}`);
    toast.success("Portfolio link copied! 🔗");
  };

  if (!summary) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // First-time user with no skills
  if (summary.totalScore === 0) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto mt-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Welcome to StudentTwin!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              Start by adding your skills. The AI will generate your personalized roadmap, quizzes, and career advice.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/add-skill" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2">
                <FiCode /> Add Your First Skill
              </a>
              <a href="/onboarding" className="border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2">
                <FiTarget /> Run Setup Wizard
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in duration-500 space-y-6">

        {/* ── HERO HEADER ── */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-7 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Student Insight Dashboard</h1>
              <p className="text-indigo-200 text-sm">
                {summary.readiness >= 80
                  ? "🔥 You're almost job-ready! Keep going."
                  : summary.readiness >= 50
                  ? "⚡ Good progress — keep building skills."
                  : "🌱 Early stage — each skill moves you forward."}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <button onClick={() => navigate("/quiz")} className="bg-white/15 hover:bg-white/25 transition px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
                <FiZap size={14} /> Quiz
              </button>
              <button onClick={() => navigate("/interview")} className="bg-white/15 hover:bg-white/25 transition px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5">
                <FiMic size={14} /> Interview
              </button>
              <button onClick={copyPortfolio} className="bg-white text-indigo-600 font-extrabold px-4 py-2 rounded-xl shadow text-sm hover:bg-gray-50 transition flex items-center gap-1.5">
                <FiShare2 size={14} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* ── BADGES ── */}
        {summary.badges?.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500 mr-1">Badges</span>
            {summary.badges.map(b => (
              <div key={b.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border ${b.color?.includes("bg-") ? b.color : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"}`}>
                <span>{b.icon}</span><span>{b.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── AI DAILY QUEST ── */}
        {quest && !quest.completed && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div>
              <h3 className="font-extrabold flex items-center gap-2 mb-1 text-sm uppercase tracking-wider">
                <FiTarget size={15} /> AI Daily Quest
              </h3>
              <p className="text-amber-100 text-sm">{quest.quest}</p>
            </div>
            <button
              onClick={handleCompleteQuest}
              className="whitespace-nowrap bg-white text-orange-600 font-extrabold px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center gap-2 transition text-sm flex-shrink-0"
            >
              <FiCheckCircle size={15} /> Complete (+20 XP)
            </button>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard title="XP Earned"    value={summary.xp}                    icon={FiAward}     color="indigo"  subtitle="Total experience" />
          <StatCard title="Streak"       value={`${summary.streak}d`}          icon={FiActivity}  color="amber"   subtitle="Days in a row" />
          <StatCard title="Total Score"  value={summary.totalScore}             icon={FiStar}      color="purple"  subtitle="Cumulative score" />
          <StatCard title="Consistency"  value={`${summary.consistency}%`}     icon={FiClock}     color="emerald" subtitle="Weekly average" />
          <StatCard title="Readiness"    value={`${summary.readiness}%`}       icon={FiTrendingUp} color="rose"   subtitle="Career readiness" />
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Skill chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Skill Performance</h3>
            <SkillChart skills={skills} />
          </div>

          {/* Summary panel */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Quick Analysis</h3>
            <div className="space-y-4">
              {summary.weakSkills?.length > 0 && (
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-xl">
                  <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider mb-0.5">Needs Attention</p>
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">{summary.weakSkills.join(", ")}</p>
                  </div>
                </div>
              )}
              {summary.nextAction && (
                <div className="flex items-start gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900 rounded-xl">
                  <FiTarget className="text-indigo-500 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">Next Action</p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">{summary.nextAction}</p>
                  </div>
                </div>
              )}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  You are <strong className="text-indigo-600 dark:text-indigo-400">{summary.readiness}%</strong> career-ready.
                  {summary.readiness < 80 ? " Keep building skills to close the gap." : " You're in great shape for job applications!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Skill Quiz", desc: "Test your knowledge", icon: FiZap, href: "/quiz", color: "indigo" },
            { label: "Mock Interview", desc: "AI-powered practice", icon: FiMic, href: "/interview", color: "purple" },
            { label: "Focus Mode", desc: "25-min Pomodoro", icon: FiClock, href: "/focus", color: "emerald" },
            { label: "Roadmap", desc: "Your learning path", icon: FiTrendingUp, href: "/roadmap", color: "amber" },
          ].map(a => (
            <a key={a.label} href={a.href} className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center ${
                a.color === "indigo" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" :
                a.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                a.color === "emerald" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              }`}>
                <a.icon size={17} />
              </div>
              <p className="font-bold text-gray-800 dark:text-white text-sm">{a.label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{a.desc}</p>
            </a>
          ))}
        </div>

        {/* ── GITHUB SYNC ── */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2 text-sm">
            <FiGithub size={16} /> GitHub Auto-Sync
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Connect GitHub to auto-earn XP from your repositories.</p>
          <div className="flex gap-2">
            <input
              className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-gray-400 transition"
              placeholder="GitHub username"
              value={githubUsername}
              onChange={e => setGithubUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGithubSync()}
            />
            <button
              onClick={handleGithubSync}
              disabled={syncing}
              className="bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50 flex items-center gap-2"
            >
              <FiGithub size={14} /> {syncing ? "Syncing..." : "Sync"}
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
}