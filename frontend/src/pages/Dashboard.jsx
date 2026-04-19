import { useEffect, useState } from "react";
import API from "../services/api";
import { getUser } from "../services/auth";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import SkillChart from "../components/SkillChart";
import { FiAward, FiStar, FiClock, FiActivity, FiTarget, FiCheckCircle } from "react-icons/fi";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [skills, setSkills] = useState([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [quest, setQuest] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const summaryRes = await API.get("/summary");
        const analyticsRes = await API.get("/analytics");

        setSummary(summaryRes.data.data);

        const formatted = Object.entries(
          analyticsRes.data.data.skillLevels
        ).map(([name, val]) => ({
          name,
          score: val.score,
        }));

        setSkills(formatted);

        try {
          const qRes = await API.get("/gamification/quest");
          setQuest(qRes.data.data);
        } catch (e) {
          console.error("Quest Error", e);
        }

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const handleGithubSync = async () => {
    if (!githubUsername) return;
    try {
      setSyncing(true);
      await API.post("/github/link", { username: githubUsername });
      const res = await API.post("/github/sync");
      alert(res.data?.message || "Successfully linked and synced GitHub repos!");
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to link GitHub");
    } finally {
      setSyncing(false);
    }
  };

  const handleCompleteQuest = async () => {
    try {
      const res = await API.post("/gamification/quest/complete");
      alert(res.data.message || "Quest Completed!");
      setQuest(prev => ({ ...prev, completed: true }));
      setSummary(prev => ({ ...prev, xp: prev.xp + res.data.data.xpEarned }));
    } catch(err) {
      alert("Failed to complete quest or already done.");
    }
  };

  if (!summary) return <p className="p-6 dark:text-white">Loading dashboard...</p>;

  // 🔥 First-time user flow
  if (summary.totalScore === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition duration-300 text-center">
            <h2 className="text-xl font-bold mb-2 dark:text-white">
              Welcome 🚀
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Start by adding your skills
            </p>
            <a
              href="/add-skill"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300 inline-block"
            >
              Add Skill
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 🌈 GRADIENT HEADER */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl mb-6 shadow flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Student Insight Dashboard
          </h1>
          <p className="mt-2">
            Track your growth and improve faster 🚀
          </p>
        </div>
        <button
          className="bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-lg shadow hover:bg-gray-100 transition whitespace-nowrap"
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/profile/${getUser()?.name || 'user'}`
            );
            alert("Link copied!");
          }}
        >
          Share Portfolio
        </button>
      </div>

      {summary.badges && summary.badges.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs uppercase tracking-widest font-black text-gray-500 mr-2">Badges</span>
          {summary.badges.map(b => (
            <div key={b.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${b.color.includes('bg-') ? b.color : 'bg-white border border-gray-200'}`}>
              <span>{b.icon}</span>
              <span>{b.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* 🔥 AI DAILY QUEST */}
      {quest && !quest.completed && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-2xl mb-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in zoom-in-95">
          <div>
            <h3 className="font-extrabold flex items-center gap-2 mb-1"><FiTarget /> AI Daily Quest</h3>
            <p className="text-indigo-100 text-sm">{quest.quest}</p>
          </div>
          <button 
            onClick={handleCompleteQuest}
            className="whitespace-nowrap bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 flex items-center gap-2 transition"
          >
            <FiCheckCircle /> Complete (+20 XP)
          </button>
        </div>
      )}

      {/* 🔥 GAMIFICATION CARDS */}
      <div className="grid md:grid-cols-5 gap-4">
        <StatCard title="🏆 XP" value={summary.xp} />
        <StatCard title="🔥 Streak" value={`${summary.streak} days`} />
        <StatCard title="Total Score" value={summary.totalScore} />
        <StatCard title="Consistency" value={`${summary.consistency}%`} />
        <StatCard title="Readiness" value={`${summary.readiness}%`} />
      </div>

      {/* 🔥 VALUE MESSAGE */}
      <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow mt-6 hover:shadow-lg transition duration-300">
        <p>
          You are <b className="text-indigo-600 dark:text-indigo-400">{summary.readiness}%</b> ready for backend roles.
        </p>
      </div>

      {/* 🔥 CHARTS */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.01] transition duration-300">
          <h3 className="mb-3 font-semibold">
            Skill Performance
          </h3>
          <SkillChart skills={skills} />
        </div>

        <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-xl shadow hover:shadow-lg hover:scale-[1.01] transition duration-300">
          <h3 className="mb-3 font-semibold">
            Summary
          </h3>

          <p className="text-red-500 dark:text-red-400">
            Weak: {summary.weakSkills.join(", ")}
          </p>

          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Next Action: {summary.nextAction}
          </p>
        </div>
      </div>

      {/* 🔥 INSIGHTS SECTION */}
      <div className="bg-gray-900 text-white p-5 rounded-xl mt-6 shadow hover:shadow-lg transition duration-300">
        <h3 className="mb-2 font-semibold text-purple-400">
          Insights
        </h3>

        <p>
          Focus on <b className="text-indigo-300">{summary.weakSkills ? summary.weakSkills[0] : ""}</b> to improve faster.
        </p>

        <p className="mt-2 text-gray-300">
          Your consistency is {summary.consistency}% — try improving daily study habits.
        </p>
      </div>

      {/* 🔥 GITHUB SYNC SECTION */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl mt-6 shadow hover:shadow-lg transition duration-300 border border-gray-100 dark:border-gray-700">
        <h3 className="mb-2 font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
          GitHub Auto-Sync
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Connect your GitHub account to auto-update your XP and showcase your activity.</p>
        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="GitHub Username"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
          />
          <button 
            onClick={handleGithubSync}
            disabled={syncing}
            className="bg-gray-900 hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white px-4 py-2 rounded transition-colors font-medium disabled:opacity-50"
          >
            {syncing ? "Syncing..." : "Sync Repos"}
          </button>
        </div>
      </div>

      {/* 🔥 LEGEND & FOOTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mt-6">
        <div className="flex gap-4">
          <p className="text-red-500 dark:text-red-400">● Weak</p>
          <p className="text-yellow-500 dark:text-yellow-400">● Medium</p>
          <p className="text-green-500 dark:text-green-400">● Strong</p>
        </div>
        
        <p className="text-sm text-gray-400 mt-4 md:mt-0 font-medium tracking-wide">
          Powered by AI + Analytics
        </p>
      </div>
      
    </Layout>
  );
}