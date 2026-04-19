import { useEffect, useState } from "react";
import API from "../services/api";

export default function Recommendations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await API.get("/recommendations");
        setData(res.data.data.recommendations || []);
      } catch (err) {
        console.error("Failed to load recommendations:", err);
        // Fallback to mock data if API fails
        setData([
          "Focus on JavaScript fundamentals to strengthen your core programming skills",
          "Practice React hooks daily to improve component state management",
          "Build 2-3 small projects to solidify your understanding of modern web development",
          "Learn Git version control for better project management",
          "Study data structures and algorithms for technical interview preparation"
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">🤖 AI Recommendations</h2>
          <p className="text-gray-600">Loading personalized recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-2">🤖 AI Recommendations</h2>
          <p className="text-purple-100">Personalized learning suggestions based on your progress</p>
        </div>

        <div className="grid gap-4">
          {data.map((recommendation, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-purple-500"
            >
              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {index + 1}
                </span>
                <p className="text-gray-800 leading-relaxed">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <p className="text-gray-500">No recommendations available yet. Keep learning to get personalized suggestions!</p>
          </div>
        )}
      </div>
    </div>
  );
}
