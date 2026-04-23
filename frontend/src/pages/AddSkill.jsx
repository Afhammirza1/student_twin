import { useState } from "react";
import { addSkill } from "../services/skill";
import {
  FiCode, FiBriefcase, FiAward, FiStar, FiZap, FiCheck,
  FiChevronRight, FiPlus, FiX
} from "react-icons/fi";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import QuizModal from "../components/QuizModal";

const POPULAR_SKILLS = [
  "Python", "JavaScript", "React", "Node.js", "TypeScript",
  "Java", "SQL", "Docker", "AWS", "Machine Learning",
  "Flutter", "Go", "Rust", "GraphQL", "MongoDB",
];

const LEVEL_LABELS = {
  1: "Exposure",  2: "Exploring", 3: "Learning",
  4: "Building",  5: "Competent", 6: "Proficient",
  7: "Advanced",  8: "Expert",    9: "Authority",
  10: "Master",
};

const LEVEL_COLOR = (l) => {
  if (l <= 3) return "text-red-500";
  if (l <= 6) return "text-amber-500";
  if (l <= 8) return "text-indigo-500";
  return "text-emerald-500";
};

function AddSkill() {
  const [form, setForm] = useState({ skillName: "", level: 5, projects: 0, certifications: 0 });
  const [loading, setLoading] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skillName.trim()) { toast.error("Skill name is required"); return; }
    setLoading(true);
    try {
      await addSkill(form);
      const existing = JSON.parse(localStorage.getItem("skills")) || [];
      localStorage.setItem("skills", JSON.stringify([...existing, { skillName: form.skillName, level: form.level }]));
      toast.success(`${form.skillName} added! +XP earned 🚀`);
      setLastAdded(form.skillName);
      setForm({ skillName: "", level: 5, projects: 0, certifications: 0 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding skill");
    } finally {
      setLoading(false);
    }
  };

  const levelPct = ((form.level - 1) / 9) * 100;

  return (
    <>
      <Layout>
        <div className="page max-w-2xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <FiPlus size={18} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Add New Skill</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add competencies to build your professional profile</p>
              </div>
            </div>
          </div>

          {/* Main card */}
          <div className="card p-7 mb-5">
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Skill name */}
              <div>
                <label className="label mb-3 flex items-center gap-1.5">
                  <FiCode size={11} /> Skill Name
                </label>
                <input
                  className="input-field text-base"
                  placeholder="e.g. React, Python, AWS…"
                  value={form.skillName}
                  onChange={e => setForm({ ...form, skillName: e.target.value })}
                  id="addskill-name"
                  autoFocus
                />
                {/* Quick-pick chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {POPULAR_SKILLS.filter(s => !form.skillName || s.toLowerCase().includes(form.skillName.toLowerCase())).slice(0, 8).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, skillName: s })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        form.skillName === s
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mastery level slider */}
              <div>
                <label className="label mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FiStar size={11} /> Mastery Level</span>
                  <span className={`text-sm font-extrabold ${LEVEL_COLOR(form.level)}`}>
                    {form.level}/10 — {LEVEL_LABELS[form.level]}
                  </span>
                </label>
                <input
                  type="range" min="1" max="10"
                  value={form.level}
                  onChange={e => setForm({ ...form, level: +e.target.value })}
                  style={{ "--val": `${levelPct}%` }}
                  className="w-full"
                  id="addskill-level"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-300 dark:text-gray-600 mt-1.5 px-0.5">
                  <span>Beginner</span><span>Intermediate</span><span>Expert</span>
                </div>
              </div>

              {/* Projects + Certifications */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="label mb-2 flex items-center gap-1.5">
                    <FiBriefcase size={11} /> Projects Built
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, projects: Math.max(0, f.projects - 1) }))}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition font-bold text-lg"
                    >−</button>
                    <input
                      type="number" min="0" max="50"
                      className="input-field text-center font-extrabold text-lg h-10 px-2"
                      value={form.projects}
                      onChange={e => setForm({ ...form, projects: Math.max(0, Math.min(50, +e.target.value)) })}
                      id="addskill-projects"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, projects: Math.min(50, f.projects + 1) }))}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition font-bold text-lg"
                    >+</button>
                  </div>
                </div>
                <div>
                  <label className="label mb-2 flex items-center gap-1.5">
                    <FiAward size={11} /> Certifications
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, certifications: Math.max(0, f.certifications - 1) }))}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition font-bold text-lg"
                    >−</button>
                    <input
                      type="number" min="0" max="50"
                      className="input-field text-center font-extrabold text-lg h-10 px-2"
                      value={form.certifications}
                      onChange={e => setForm({ ...form, certifications: Math.max(0, Math.min(50, +e.target.value)) })}
                      id="addskill-certs"
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, certifications: Math.min(50, f.certifications + 1) }))}
                      className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition font-bold text-lg"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Score preview */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <p className="label mb-2">Estimated Score Preview</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, form.level * 5 + form.projects * 10 + form.certifications * 8)}%` }}
                    />
                  </div>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 w-12 text-right">
                    ~{Math.min(100, form.level * 5 + form.projects * 10 + form.certifications * 8)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">Based on level × 5 + projects × 10 + certs × 8 (capped at 100)</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !form.skillName.trim()}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                id="addskill-submit"
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <><FiCheck size={18} /> Save Skill — Earn XP</>
                }
              </button>
            </form>

            {/* Post-add CTA */}
            {lastAdded && (
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <p className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                    <FiCheck size={15} /> {lastAdded} added successfully!
                  </p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">
                    Take an AI quiz to verify your knowledge and earn bonus XP.
                  </p>
                </div>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition whitespace-nowrap shadow-lg shadow-indigo-500/25"
                  id="addskill-quiz-btn"
                >
                  <FiZap size={14} /> Take Quiz
                </button>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="card p-5">
            <p className="label mb-3">💡 Scoring Guide</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FiStar, title: "Level", desc: "1–3 beginner, 4–6 mid, 7–10 expert" },
                { icon: FiBriefcase, title: "Projects", desc: "+2 points each, shows experience" },
                { icon: FiAward, title: "Certs", desc: "+5 points each, boosts credibility" },
              ].map(t => (
                <div key={t.title} className="text-center">
                  <t.icon className="mx-auto text-indigo-400 mb-1.5" size={16} />
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{t.title}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Layout>

      {showQuiz && lastAdded && (
        <QuizModal skillName={lastAdded} onClose={() => setShowQuiz(false)} />
      )}
    </>
  );
}

export default AddSkill;