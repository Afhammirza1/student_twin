import { useEffect, useState } from "react";
import API from "../services/api";
import { FiPieChart, FiTarget, FiActivity, FiStar } from "react-icons/fi";
import Layout from "../components/Layout";

export default function Report() {
  const [report, setReport] = useState(null);
  const [consistency, setConsistency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const r = await API.get("/report");
        const c = await API.get("/consistency");
        setReport(r.data.data);
        setConsistency(c.data.data);
      } catch (err) {
        setReport({
          strong: ["JavaScript", "React", "CSS"],
          medium: ["Node.js", "Git"],
          weak: ["Database Design", "Testing"]
        });
        setConsistency({
          consistency: 85,
          weeklyGoal: 5,
          completed: 4
        });
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
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Computing your weekly report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
        
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-10 rounded-[2rem] shadow-2xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-4xl font-extrabold mb-3 tracking-tight flex items-center gap-3">
            <FiPieChart className="text-indigo-300" /> Weekly Report
          </h2>
          <p className="text-indigo-200 text-lg font-medium opacity-90 max-w-2xl">
            Track your learning velocity, skill saturation, and consistency metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Consistency Stats */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FiActivity className="text-blue-500" /> Consistency Tracking
            </h3>
            
            <div className="space-y-6">
              <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-end mb-4 relative z-10">
                  <span className="text-blue-800 font-bold text-sm tracking-widest uppercase">Overall Score</span>
                  <span className="text-4xl font-extrabold text-blue-600">{consistency?.consistency ?? 0}%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-4 relative z-10">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    style={{ width: `${consistency?.consistency ?? 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-2xl">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-purple-800 font-bold text-sm tracking-widest uppercase">Weekly Goal</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-purple-600">{consistency?.completed ?? consistency?.activeDays ?? 0}</span>
                    <span className="text-purple-400 font-medium"> / {consistency?.weeklyGoal ?? consistency?.totalDays ?? 7} days</span>
                  </div>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-purple-600 h-4 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(147,51,234,0.4)]"
                    style={{ width: `${((consistency?.completed ?? consistency?.activeDays ?? 0) / (consistency?.weeklyGoal ?? consistency?.totalDays ?? 7)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <FiStar className="text-2xl" />
                </div>
                <div>
                  <p className="text-emerald-800 dark:text-emerald-300 font-bold mb-1">High Momentum</p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    You're maintaining a great streak. Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <FiTarget className="text-indigo-500" /> Competency Breakdown
            </h3>
            
            <div className="space-y-5">
              <div className="group border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 p-5 rounded-2xl transition-colors">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span> Supercharged Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.strong.map((skill, index) => (
                    <span key={index} className="bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="group border border-amber-100 dark:border-amber-900 hover:border-amber-300 dark:hover:border-amber-700 p-5 rounded-2xl transition-colors">
                <p className="font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> Developing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.medium.map((skill, index) => (
                    <span key={index} className="bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="group border border-red-100 dark:border-red-900 hover:border-red-300 dark:hover:border-red-700 p-5 rounded-2xl transition-colors">
                <p className="font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span> Needs Attention
                </p>
                <div className="flex flex-wrap gap-2">
                  {report.weak.map((skill, index) => (
                    <span key={index} className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </Layout>
  );
}