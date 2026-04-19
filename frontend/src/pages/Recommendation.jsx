import { useEffect, useState } from "react";
import API from "../services/api";
import { FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import Layout from "../components/Layout";

export default function Recommendation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get("/recommendations");
        const list = res?.data?.data?.recommendations || [];
        setData(list);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        // Fallback or read from local if API fails loosely linked to old Recommendation.jsx logic
        const localData = JSON.parse(localStorage.getItem("skills")) || [];
        const fallbacks = localData
          .filter(s => s.level < 5)
          .map(s => `Improve ${s.skill || s.skillName} by taking on 2 new projects this week.`);
        
        setData(fallbacks.length > 0 ? fallbacks : [
          "Focus on fundamentals to strengthen your core programming skills.",
          "Practice daily to improve component state management.",
          "Build 2-3 small projects to solidify your understanding.",
          "Learn Git version control for better project management."
        ]);
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
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide">Analyzing your profile for recommendations...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-indigo-900 text-white p-10 rounded-[2rem] shadow-2xl mb-12 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-4xl font-extrabold mb-3 tracking-tight flex items-center gap-3">
              ✨ AI Assistant Insights
            </h2>
            <p className="text-purple-200 text-lg font-medium opacity-90 max-w-2xl">
              Personalized, actionable steps derived directly from your learning trajectory and current skill levels.
            </p>
          </div>

          <div className="grid gap-6">
            {data.map((rec, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 relative"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-400 to-indigo-500 rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-start gap-5">
                  <div className="bg-purple-100 text-purple-700 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    0{index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">Strategic Action</h4>
                    <p className="text-gray-600 leading-relaxed text-lg">{rec.task || rec.message || rec}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center shadow-sm">
              <FiCheckCircle className="text-6xl text-emerald-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">You're completely on track!</h3>
              <p className="text-gray-500 text-lg">Add more skills or keep learning to generate new insights.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}