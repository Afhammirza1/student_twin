import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { FiAward, FiStar, FiTrendingUp, FiUser } from "react-icons/fi";

const RANK_CONFIG = [
  { emoji: "🥇", bg: "bg-yellow-50 dark:bg-yellow-900/20",  border: "border-yellow-200 dark:border-yellow-800", badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300" },
  { emoji: "🥈", bg: "bg-gray-50 dark:bg-gray-800/60",       border: "border-gray-200 dark:border-gray-700",      badge: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300" },
  { emoji: "🥉", bg: "bg-orange-50 dark:bg-orange-900/20",  border: "border-orange-200 dark:border-orange-800",  badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300" },
];

export default function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await API.get("/public/leaderboard");
        setBoard(response.data.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const myEmail = localStorage.getItem("userEmail") || "";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white p-8 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-3">
            <FiAward size={28} /> Global Leaderboard
          </h1>
          <p className="text-amber-100 font-medium">Top learners ranked by XP and consistency streak.</p>
          <div className="mt-4 flex gap-3 flex-wrap text-sm">
            {["🏆 XP-based ranking", "🔥 Daily streaks", "📊 Readiness score"].map(tag => (
              <span key={tag} className="bg-white/15 px-3 py-1 rounded-full font-semibold">{tag}</span>
            ))}
          </div>
        </div>

        {/* Podium top-3 */}
        {!loading && board.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 0, 2].map(i => {
              const user = board[i];
              const cfg = RANK_CONFIG[i];
              const isFirst = i === 0;
              return (
                <div key={i} className={`text-center p-4 rounded-2xl border-2 ${cfg.bg} ${cfg.border} ${isFirst ? "shadow-lg" : ""} order-${i === 1 ? "1" : i === 0 ? "2" : "3"}`}
                  style={{ order: i === 1 ? 1 : i === 0 ? 0 : 2 }}>
                  <div className={`text-2xl mb-2 ${isFirst ? "text-3xl" : ""}`}>{cfg.emoji}</div>
                  <div className={`w-10 h-10 rounded-full ${cfg.badge} flex items-center justify-center font-extrabold mx-auto mb-2`}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm truncate">{user.name?.split(" ")[0]}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-black mt-1">{user.xp} XP</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{user.streak}d streak</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold">Loading top developers...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
              <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Rank / Student</span>
              <div className="flex items-center gap-6 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <span>Streak</span>
                <span className="w-16 text-right">XP</span>
              </div>
            </div>

            {board.length === 0 ? (
              <div className="p-12 text-center">
                <FiUser className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No users yet. Be the first to earn XP!</p>
              </div>
            ) : (
              <ul>
                {board.map((user, index) => {
                  const cfg = RANK_CONFIG[index];
                  const isMe = user.email === myEmail;
                  return (
                    <li
                      key={index}
                      className={`flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-700/50 last:border-0 transition-colors ${
                        isMe ? "bg-indigo-50 dark:bg-indigo-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      }`}
                    >
                      {/* Rank + Name */}
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-sm flex-shrink-0 ${
                          cfg ? cfg.badge : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                        }`}>
                          {cfg ? cfg.emoji : `#${index + 1}`}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-800 dark:text-white text-sm">{user.name}</p>
                            {isMe && <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 font-black px-1.5 py-0.5 rounded">YOU</span>}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-gray-500">Readiness: {user.readiness}%</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-right flex-shrink-0">
                        <div>
                          <p className="text-xs font-bold text-orange-500 uppercase flex items-center justify-end gap-1">
                            <FiTrendingUp size={10} /> Streak
                          </p>
                          <p className="font-extrabold text-gray-800 dark:text-white text-sm">{user.streak}d</p>
                        </div>
                        <div className="w-16">
                          <p className="text-xs font-bold text-indigo-500 uppercase flex items-center justify-end gap-1">
                            <FiStar size={10} /> XP
                          </p>
                          <p className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">{user.xp}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
