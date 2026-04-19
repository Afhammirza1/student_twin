import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FiAward, FiStar, FiTrendingUp } from "react-icons/fi";

export default function Leaderboard() {
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await axios.get("http://localhost:5000/api/public/leaderboard");
        setBoard(response.data.data);
      } catch (err) {
        console.error("Failed to load leaderboard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center gap-3">
            <FiAward className="text-yellow-500" /> Global Leaderboard
          </h1>
          <p className="text-gray-500 font-medium">Top active learners based on XP and consistency streaks.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse font-bold text-xl">Loading top developers...</div>
        ) : (
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="space-y-4">
              {board.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors border border-transparent hover:border-gray-200 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg
                      ${index === 0 ? "bg-yellow-100 text-yellow-600 shadow-sm" : 
                        index === 1 ? "bg-gray-200 text-gray-600 shadow-sm" :
                        index === 2 ? "bg-orange-100 text-orange-600 shadow-sm" :
                        "bg-white text-gray-400 border border-gray-200"}`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                      <p className="text-xs font-semibold text-gray-400">Readiness: {user.readiness}%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs font-bold text-orange-500 uppercase flex items-center justify-end gap-1"><FiTrendingUp /> Streak</p>
                      <p className="font-extrabold text-gray-800">{user.streak} days</p>
                    </div>
                    <div className="text-right w-20">
                      <p className="text-xs font-bold text-indigo-500 uppercase flex items-center justify-end gap-1"><FiStar /> XP</p>
                      <p className="font-extrabold text-indigo-600">{user.xp}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {board.length === 0 && (
                <div className="text-center py-10 text-gray-500">No users found. Be the first to earn XP!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
