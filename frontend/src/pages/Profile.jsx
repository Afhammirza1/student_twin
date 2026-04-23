import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SkillChart from "../components/SkillChart";
import { FiUser, FiCode, FiStar, FiAward, FiGithub, FiBook } from "react-icons/fi";

export default function Profile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const BACKEND = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await axios.get(`${BACKEND}/public/${username}`);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-300 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900 flex items-center justify-center text-white text-center">
        <div>
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-indigo-300">No student profile exists for <strong>@{username}</strong></p>
        </div>
      </div>
    );
  }

  const strongSkills = data.skills?.filter(s => s.score >= 70) || [];
  const medSkills    = data.skills?.filter(s => s.score >= 40 && s.score < 70) || [];
  const weakSkills   = data.skills?.filter(s => s.score < 40) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900">
      {/* Ambient glows */}
      <div className="fixed w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl top-0 right-0 pointer-events-none" />
      <div className="fixed w-64 h-64 bg-purple-600/15 rounded-full blur-3xl bottom-10 left-10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 py-12">

        {/* Hero card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-6 text-white shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-extrabold flex-shrink-0 shadow-lg">
              {data.name?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold mb-1">{data.name}'s Portfolio</h1>
              <p className="text-indigo-300 text-sm mb-3">@{username}</p>
              {data.summary && (
                <p className="text-indigo-100 leading-relaxed text-sm max-w-2xl">{data.summary}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { label: "Readiness", value: `${data.readiness || 0}%`, icon: FiStar },
              { label: "Skills",    value: data.skills?.length || 0,   icon: FiCode },
              { label: "XP",        value: `${data.xp || 0} XP`,       icon: FiAward },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center">
                <s.icon className="mx-auto text-indigo-300 mb-2" size={18} />
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-indigo-300 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub card */}
        {data.githubUsername && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FiGithub className="text-gray-300" /> GitHub Profile
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                  <FiGithub size={18} className="text-gray-300" />
                </div>
                <div>
                  <p className="font-bold">@{data.githubUsername}</p>
                  <p className="text-sm text-indigo-300">{data.githubRepos} public repositories</p>
                </div>
              </div>
              <a
                href={`https://github.com/${data.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                <FiBook size={14} /> View Profile
              </a>
            </div>
          </div>
        )}

        {/* Readiness bar */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm uppercase tracking-wider text-indigo-300">Career Readiness</span>
            <span className="text-2xl font-extrabold">{data.readiness || 0}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 shadow-lg"
              style={{ width: `${data.readiness || 0}%` }}
            />
          </div>
        </div>

        {/* Skill chart */}
        {data.skills?.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-6 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FiCode className="text-indigo-300" /> Skills Overview
            </h3>
            <SkillChart skills={data.skills} />
          </div>
        )}

        {/* Skill breakdown */}
        {data.skills?.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-4">Skill Breakdown</h3>
            <div className="space-y-3">
              {data.skills.sort((a, b) => b.score - a.score).map((skill) => (
                <div key={skill.skill_name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{skill.skill_name}</span>
                    <span className={`font-bold ${skill.score >= 70 ? "text-emerald-400" : skill.score >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                      {skill.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${skill.score >= 70 ? "bg-emerald-500" : skill.score >= 40 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-indigo-400/60 text-xs mt-8">
          Built with StudentTwin • AI-powered student progress tracker
        </p>
      </div>
    </div>
  );
}
