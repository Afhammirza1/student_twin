import { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import QuizModal from "../components/QuizModal";
import { FiZap, FiSearch, FiChevronRight } from "react-icons/fi";

const POPULAR_SKILLS = [
  "JavaScript", "Python", "React", "Node.js", "SQL",
  "Java", "TypeScript", "CSS", "Git", "Docker",
  "MongoDB", "PostgreSQL", "Express", "REST APIs", "Data Structures",
];

export default function Quiz() {
  const [skillInput, setSkillInput] = useState("");
  const [activeSkill, setActiveSkill] = useState(null);

  const startQuiz = (skill) => {
    if (!skill.trim()) return;
    setActiveSkill(skill.trim());
  };

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl font-extrabold flex items-center gap-3 mb-2">
            <FiZap size={28} /> AI Skill Quiz
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed max-w-xl">
            Test your knowledge with AI-generated questions. Earn XP for every correct answer and get instant feedback.
          </p>
          <div className="mt-5 flex gap-3 flex-wrap">
            {["5 Questions", "Choose Difficulty", "Earn XP", "Instant Feedback"].map((tag) => (
              <span key={tag} className="bg-white/15 px-3 py-1 rounded-full text-sm font-semibold">{tag}</span>
            ))}
          </div>
        </div>

        {/* Custom skill input */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Enter Any Skill
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-white font-medium transition-all"
                placeholder="e.g. React Hooks, System Design, GraphQL..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startQuiz(skillInput)}
                id="quiz-skill-input"
              />
            </div>
            <button
              onClick={() => startQuiz(skillInput)}
              disabled={!skillInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              id="quiz-custom-start"
            >
              Start <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Popular skills grid */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-sm uppercase tracking-wider">
            Popular Skill Tests
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {POPULAR_SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => startQuiz(skill)}
                className="group flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-left"
                id={`quiz-skill-${skill.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 text-sm transition-colors">{skill}</span>
                <FiChevronRight className="text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {activeSkill && (
        <QuizModal
          skillName={activeSkill}
          onClose={() => setActiveSkill(null)}
        />
      )}
    </Layout>
  );
}
