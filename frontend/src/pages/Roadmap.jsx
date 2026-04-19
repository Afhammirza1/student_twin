import { useState } from "react";
import { getRoadmap, downloadCalendar } from "../services/roadmap";
import { FiMap, FiDownload, FiCheckCircle, FiLoader } from "react-icons/fi";
import Layout from "../components/Layout";

function Roadmap() {
  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [roadmapType, setRoadmapType] = useState("");
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const fetchRoadmap = async () => {
    if (!goal.trim()) {
      alert("Please enter a goal");
      return;
    }

    setLoading(true);
    try {
      const res = await getRoadmap({ goal, useAI });
      const result = res.data.data || res.data;
      const type = result.type;
      setRoadmapType(type);

      if (type === "AI") {
        const lines = Array.isArray(result.roadmap)
          ? result.roadmap
          : result.roadmap.split("\n").filter((item) => item.trim());

        const parsed = lines.map((line, i) => ({
          day: i + 1,
          task: typeof line === "string" ? line : line.task || String(line),
        }));
        setRoadmap(parsed);
      } else {
        setRoadmap(result.roadmap || []);
      }
    } catch (err) {
      console.error("Roadmap error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to generate roadmap");
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
      console.error("Calendar download error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to download calendar");
    }
  };

  return (
    <Layout>
      <div className="animate-in fade-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FiMap className="text-indigo-600" /> Smart Learning Roadmap
          </h1>
          <p className="text-gray-500 mt-2">Generate AI or Adaptive roadmaps for any tech goal.</p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
            <input
              className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-800 font-medium"
              placeholder="Enter your goal (e.g. Full Stack Developer, Learn Rust)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <button 
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0"
              onClick={fetchRoadmap} 
              disabled={loading}
            >
              {loading ? <FiLoader className="animate-spin text-xl" /> : "Generate"}
            </button>
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-colors inline-flex">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded-md focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-gray-700 font-semibold flex items-center gap-2">
              ✨ Generate with Artificial Intelligence
            </span>
          </label>
        </div>

        {roadmap.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Your Journey Plan
                {roadmapType && (
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ml-2 ${
                    roadmapType === "AI" ? "bg-purple-100 text-purple-700" :
                    roadmapType === "ADAPTIVE" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {roadmapType}
                  </span>
                )}
              </h3>

              <button 
                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md flex items-center gap-2 text-sm"
                onClick={handleDownload}
              >
                <FiDownload /> Calendar Backup
              </button>
            </div>
            
            <div className="relative border-l-2 border-indigo-100 ml-4 pb-4">
              {roadmap.map((r, i) => (
                <div key={i} className="mb-8 relative pl-8 group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 shadow group-hover:scale-125 transition-transform"></span>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-lg transition-all group-hover:border-indigo-100 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                    
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block text-indigo-600 font-extrabold uppercase tracking-wide text-sm mb-1">
                          Day {r.day || i + 1}
                        </span>
                        <p className="text-gray-800 font-medium text-lg w-full">{r.task || r}</p>
                      </div>
                      {r.week && (
                        <span className="text-indigo-500 text-xs font-bold bg-indigo-50 px-3 py-1 rounded-full whitespace-nowrap">
                          Week {r.week}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}

export default Roadmap;