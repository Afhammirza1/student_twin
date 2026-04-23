import { useState } from "react";
import API from "../services/api";
import { FiX, FiZap, FiCheck, FiXCircle, FiLoader, FiAward, FiTarget } from "react-icons/fi";
import toast from "react-hot-toast";

const LEVELS = ["beginner", "intermediate", "advanced"];

const gradeConfig = {
  STRONG: { label: "Excellent!", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: "🏆" },
  MEDIUM: { label: "Good Effort", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", icon: "📈" },
  WEAK:   { label: "Keep Practicing", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: "💪" },
};

export default function QuizModal({ skillName, onClose }) {
  const [step, setStep] = useState("config"); // config | loading | quiz | result
  const [level, setLevel] = useState("intermediate");
  const [questions, setQuestions] = useState([]);
  const [token, setToken] = useState("");
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const generateQuiz = async () => {
    setStep("loading");
    try {
      const res = await API.post("/quiz/generate", { skill: skillName, level });
      setQuestions(res.data.data.questions);
      setToken(res.data.data.token);
      setAnswers({});
      setCurrent(0);
      setStep("quiz");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate quiz. Try again.");
      setStep("config");
    }
  };

  const handleAnswer = (questionId, letter) => {
    setAnswers(prev => ({ ...prev, [questionId]: letter }));
  };

  const handleNext = () => {
    if (!answers[questions[current].id]) {
      toast.error("Please select an answer first");
      return;
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }
    setSubmitting(true);
    try {
      const res = await API.post("/quiz/submit", { token, answers });
      setResult(res.data.data);
      setStep("result");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed. Try again.");
    }
    setSubmitting(false);
  };

  const optionLetter = (opt) => opt.charAt(0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <FiZap /> AI Skill Quiz
            </h2>
            <p className="text-indigo-200 text-sm mt-0.5">{skillName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition" id="quiz-close-btn">
            <FiX size={20} />
          </button>
        </div>

        {/* ─── STEP: Config ─── */}
        {step === "config" && (
          <div className="p-8">
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Take a <strong>5-question AI-generated quiz</strong> on <strong>{skillName}</strong>. 
              The AI will score you and award XP based on your performance.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`py-3 rounded-xl font-bold text-sm capitalize transition-all border-2 ${
                      level === l
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                        : "border-gray-200 text-gray-500 hover:border-indigo-300 dark:border-gray-700 dark:text-gray-400"
                    }`}
                    id={`quiz-level-${l}`}
                  >
                    {l === "beginner" ? "🌱 Beginner" : l === "intermediate" ? "⚡ Intermediate" : "🔥 Advanced"}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4 mb-6 text-sm text-indigo-700 dark:text-indigo-300">
              <p className="font-semibold mb-1">📊 XP Rewards</p>
              <p>5 XP per correct answer • Bonus 10 XP for a perfect score</p>
            </div>
            <button
              onClick={generateQuiz}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              id="quiz-start-btn"
            >
              <FiZap /> Generate Quiz
            </button>
          </div>
        )}

        {/* ─── STEP: Loading ─── */}
        {step === "loading" && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">Generating your quiz...</p>
            <p className="text-gray-400 text-sm mt-2">AI is crafting 5 tailored questions for {skillName}</p>
          </div>
        )}

        {/* ─── STEP: Quiz ─── */}
        {step === "quiz" && questions.length > 0 && (
          <div className="p-6">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{current + 1} / {questions.length}</span>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Question {current + 1}</p>
              <p className="text-gray-800 dark:text-gray-100 font-semibold text-lg leading-relaxed">
                {questions[current].question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {questions[current].options.map((opt) => {
                const letter = optionLetter(opt);
                const selected = answers[questions[current].id] === letter;
                return (
                  <button
                    key={letter}
                    onClick={() => handleAnswer(questions[current].id, letter)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all text-sm ${
                      selected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    id={`quiz-option-${letter}`}
                  >
                    <span className={`inline-block w-7 h-7 rounded-lg mr-3 text-center text-xs font-black leading-7 ${
                      selected ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>{letter}</span>
                    {opt.slice(3)}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {current > 0 && (
                <button onClick={() => setCurrent(current - 1)} className="px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Back
                </button>
              )}
              {current < questions.length - 1 ? (
                <button onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition" id="quiz-next-btn">
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold py-3 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
                  id="quiz-submit-btn"
                >
                  {submitting ? <><FiLoader className="animate-spin" /> Scoring...</> : <><FiTarget /> Submit Quiz</>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP: Result ─── */}
        {step === "result" && result && (() => {
          const cfg = gradeConfig[result.grade];
          return (
            <div className="p-6">
              {/* Score summary */}
              <div className={`border-2 rounded-2xl p-6 mb-6 text-center ${cfg.bg}`}>
                <p className="text-4xl mb-2">{cfg.icon}</p>
                <p className={`text-2xl font-extrabold ${cfg.color}`}>{cfg.label}</p>
                <p className="text-5xl font-black text-gray-800 dark:text-gray-100 my-2">{result.percentage}%</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {result.correct} of {result.total} correct
                </p>
                {result.xpEarned > 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm">
                    <FiAward /> +{result.xpEarned} XP Earned!
                  </div>
                )}
              </div>

              {/* Per-question breakdown */}
              <div className="space-y-3 max-h-60 overflow-y-auto mb-6">
                {result.results.map((r) => (
                  <div key={r.id} className={`flex items-start gap-3 p-4 rounded-xl border ${r.isCorrect ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}>
                    <div className={`mt-0.5 flex-shrink-0 ${r.isCorrect ? "text-emerald-500" : "text-red-500"}`}>
                      {r.isCorrect ? <FiCheck size={16} /> : <FiXCircle size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-snug">{r.question}</p>
                      {!r.isCorrect && (
                        <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                          Your answer: <strong>{r.yourAnswer}</strong> → Correct: <strong>{r.correctAnswer}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setStep("config"); setResult(null); }} className="flex-1 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Retry Quiz
                </button>
                <button onClick={onClose} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition" id="quiz-done-btn">
                  Done ✓
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
