import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { FiArrowRight, FiArrowLeft, FiCheck, FiCode, FiGithub, FiTarget, FiUser } from "react-icons/fi";

const CAREER_GOALS = [
  { id: "frontend", label: "Frontend Developer", emoji: "🎨", skills: ["React", "JavaScript", "CSS", "TypeScript"] },
  { id: "backend", label: "Backend Developer", emoji: "⚙️", skills: ["Node.js", "Python", "SQL", "Java"] },
  { id: "fullstack", label: "Full Stack Developer", emoji: "🔥", skills: ["React", "Node.js", "SQL", "MongoDB"] },
  { id: "data", label: "Data Scientist", emoji: "📊", skills: ["Python", "SQL", "Machine Learning", "Pandas"] },
  { id: "devops", label: "DevOps Engineer", emoji: "🚀", skills: ["Docker", "AWS", "Linux", "CI/CD"] },
  { id: "mobile", label: "Mobile Developer", emoji: "📱", skills: ["React Native", "Flutter", "Swift", "Kotlin"] },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "0-1 years, learning the basics", emoji: "🌱" },
  { id: "intermediate", label: "Intermediate", desc: "1-3 years, building real projects", emoji: "⚡" },
  { id: "advanced", label: "Advanced", desc: "3+ years, production experience", emoji: "🔥" },
];

const STEPS = ["Welcome", "Career Goal", "Experience", "First Skill", "GitHub (Optional)"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    careerGoal: null,
    experience: null,
    skillName: "",
    skillLevel: 5,
    skillProjects: 0,
    githubUsername: "",
  });

  const canNext = () => {
    if (step === 1) return !!data.careerGoal;
    if (step === 2) return !!data.experience;
    if (step === 3) return data.skillName.trim().length > 0;
    return true;
  };

  const next = () => { if (canNext()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const finish = async () => {
    setLoading(true);
    try {
      // Add first skill
      if (data.skillName.trim()) {
        await API.post("/skills", {
          skillName: data.skillName.trim(),
          level: data.skillLevel,
          projects: data.skillProjects,
          certifications: 0,
        });
      }

      // Link GitHub if provided
      if (data.githubUsername.trim()) {
        try {
          await API.post("/github/link", { username: data.githubUsername.trim() });
          await API.post("/github/sync");
          toast.success("GitHub linked and synced! 🐙");
        } catch {
          // Non-critical
        }
      }

      // Mark onboarding complete in localStorage
      localStorage.setItem("onboardingDone", "true");
      toast.success("Welcome to StudentTwin! 🎉 Let's track your growth.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Setup failed, please try again.");
    }
    setLoading(false);
  };

  const selectedGoal = CAREER_GOALS.find(g => g.id === data.careerGoal);
  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900 flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl top-10 left-10 pointer-events-none" />
      <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-3xl bottom-10 right-10 pointer-events-none" />

      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-500">

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800">
          <div
            className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step header */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className={`transition-all duration-300 ${i === step ? "w-6 h-2 bg-indigo-600 rounded-full" : i < step ? "w-2 h-2 bg-indigo-400 rounded-full" : "w-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{STEPS[step]}</span>
        </div>

        <div className="px-8 py-6">

          {/* ─── STEP 0: Welcome ─── */}
          {step === 0 && (
            <div className="text-center py-4">
              <div className="text-6xl mb-5">🎓</div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                Welcome to StudentTwin!
              </h1>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                Let's set up your profile in <strong>under 2 minutes</strong>. We'll personalize your dashboard, roadmap, and AI coaching based on your goals.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { icon: "📈", label: "Track Skills" },
                  { icon: "🤖", label: "AI Coaching" },
                  { icon: "🏆", label: "Earn XP" },
                ].map(f => (
                  <div key={f.label} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 text-center">
                    <span className="text-2xl">{f.icon}</span>
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mt-1">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 1: Career Goal ─── */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">What's your goal?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">We'll personalize your roadmap and recommendations.</p>
              <div className="grid grid-cols-2 gap-3">
                {CAREER_GOALS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setData(d => ({ ...d, careerGoal: g.id }))}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                      data.careerGoal === g.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                    }`}
                    id={`onboard-goal-${g.id}`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <span className={`text-sm font-bold ${data.careerGoal === g.id ? "text-indigo-700 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>
                      {g.label}
                    </span>
                  </button>
                ))}
              </div>
              {selectedGoal && (
                <p className="mt-4 text-xs text-indigo-600 dark:text-indigo-400 font-medium animate-in fade-in">
                  We'll suggest: {selectedGoal.skills.join(", ")}
                </p>
              )}
            </div>
          )}

          {/* ─── STEP 2: Experience ─── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Your experience level?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">This helps calibrate your quiz difficulty and coaching style.</p>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setData(d => ({ ...d, experience: e.id }))}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                      data.experience === e.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                    }`}
                    id={`onboard-exp-${e.id}`}
                  >
                    <span className="text-3xl">{e.emoji}</span>
                    <div>
                      <p className={`font-bold ${data.experience === e.id ? "text-indigo-700 dark:text-indigo-300" : "text-gray-800 dark:text-gray-100"}`}>{e.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{e.desc}</p>
                    </div>
                    {data.experience === e.id && (
                      <FiCheck className="ml-auto text-indigo-500 flex-shrink-0" size={18} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── STEP 3: First Skill ─── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Add your first skill</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                {selectedGoal ? `Suggested for ${selectedGoal.label}:` : "Start with your strongest skill."}
              </p>

              {selectedGoal && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedGoal.skills.map(s => (
                    <button
                      key={s}
                      onClick={() => setData(d => ({ ...d, skillName: s }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                        data.skillName === s
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <input
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white font-medium mb-4 transition-all"
                placeholder="Skill name (e.g., Python)"
                value={data.skillName}
                onChange={e => setData(d => ({ ...d, skillName: e.target.value }))}
                id="onboard-skill-input"
              />

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Mastery Level</label>
                    <span className="text-xs font-bold text-indigo-600">{data.skillLevel} / 10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={data.skillLevel}
                    onChange={e => setData(d => ({ ...d, skillLevel: +e.target.value }))}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">Projects Built</label>
                  <input
                    type="number" min="0" max="50" value={data.skillProjects}
                    onChange={e => setData(d => ({ ...d, skillProjects: +e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white font-medium transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: GitHub ─── */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Link GitHub <span className="text-gray-400 font-normal">(optional)</span></h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">
                We'll scan your public repos and award bonus XP for original projects.
              </p>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiGithub className="text-gray-700 dark:text-gray-300" size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">GitHub Sync Benefits</p>
                  <ul className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                    <li>• 5 XP per original repository</li>
                    <li>• 50 XP bonus for 10+ repos</li>
                    <li>• Auto-detect technologies you use</li>
                  </ul>
                </div>
              </div>

              <div className="relative">
                <FiGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white font-medium transition-all"
                  placeholder="Your GitHub username"
                  value={data.githubUsername}
                  onChange={e => setData(d => ({ ...d, githubUsername: e.target.value }))}
                  id="onboard-github-input"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">You can always link this later from your Dashboard.</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button onClick={back} className="flex items-center gap-2 px-5 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <FiArrowLeft size={16} /> Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={!canNext()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-40 hover:-translate-y-0.5 disabled:translate-y-0"
                id="onboard-next-btn"
              >
                {step === 0 ? "Get Started" : "Continue"} <FiArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-60"
                id="onboard-finish-btn"
              >
                {loading ? "Setting up..." : <><FiCheck size={16} /> Launch Dashboard</>}
              </button>
            )}
          </div>

          {step === 4 && (
            <button
              onClick={finish}
              disabled={loading}
              className="w-full mt-3 text-center text-sm text-gray-400 hover:text-gray-600 transition font-medium"
              id="onboard-skip-btn"
            >
              Skip GitHub for now →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
