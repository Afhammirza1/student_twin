import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { FiMic, FiSend, FiUser, FiMonitor, FiAward, FiCheckCircle, FiTrendingUp, FiRefreshCw, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";

const TOTAL_QUESTIONS = 5;

function ScoreBar({ score }) {
  const pct = Math.round((score / 10) * 100);
  const color = score >= 8 ? "bg-emerald-500" : score >= 6 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 w-8 text-right">{score}/10</span>
    </div>
  );
}

export default function Interview() {
  const [phase, setPhase] = useState("intro");   // intro | active | summary
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastEval, setLastEval] = useState(null);
  const [summary, setSummary] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, lastEval]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const res = await API.post("/interview/start");
      const { question, token: t, questionNumber: qn } = res.data.data;
      setToken(t);
      setQuestionNumber(qn);
      setMessages([{ role: "ai", content: question }]);
      setPhase("active");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start interview. Try again.");
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!userInput.trim()) { toast.error("Please type your answer first"); return; }
    const answer = userInput.trim();
    setUserInput("");
    setLoading(true);

    // Optimistically add user message
    setMessages(prev => [...prev, { role: "user", content: answer }]);

    try {
      const res = await API.post("/interview/answer", { token, answer });
      const data = res.data.data;

      setToken(data.token);
      setLastEval(data.evaluation);

      if (data.done) {
        setSummary(data.summary);
        setXpEarned(data.xpEarned || 0);
        setPhase("summary");
      } else {
        setMessages(prev => [...prev, { role: "ai", content: data.question }]);
        setQuestionNumber(data.questionNumber);
        setTimeout(() => setLastEval(null), 4000); // auto-hide eval after 4s
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit answer.");
      setMessages(prev => prev.slice(0, -1)); // revert optimistic update
    }
    setLoading(false);
  };

  const reset = () => {
    setPhase("intro");
    setMessages([]);
    setToken("");
    setQuestionNumber(0);
    setUserInput("");
    setLastEval(null);
    setSummary(null);
    setXpEarned(0);
  };

  const gradeColors = {
    "Strong Candidate": "text-emerald-600 bg-emerald-50 border-emerald-200",
    "Good Candidate": "text-blue-600 bg-blue-50 border-blue-200",
    "Developing": "text-yellow-600 bg-yellow-50 border-yellow-200",
    "Needs Improvement": "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

        {/* ─── INTRO ─── */}
        {phase === "intro" && (
          <div>
            {/* Hero */}
            <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
              <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🎤</div>
                  <div>
                    <h1 className="text-2xl font-extrabold">AI Mock Interview</h1>
                    <p className="text-indigo-300 text-sm">Personalized to your skill profile</p>
                  </div>
                </div>
                <p className="text-indigo-100 leading-relaxed max-w-xl">
                  Practice with an AI interviewer that knows your skills. Get real-time feedback on every answer, 
                  an overall performance score, and earn XP for completing the session.
                </p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: FiMonitor, label: "5 Questions", desc: "Tailored to your skills", color: "text-indigo-600 bg-indigo-50" },
                { icon: FiStar, label: "Live Feedback", desc: "Scored after each answer", color: "text-yellow-600 bg-yellow-50" },
                { icon: FiAward, label: "Earn XP", desc: "Up to 20 XP per session", color: "text-emerald-600 bg-emerald-50" },
              ].map((f) => (
                <div key={f.label} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-gray-100 dark:border-gray-700 text-center">
                  <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-3 ${f.color}`}>
                    <f.icon size={20} />
                  </div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-5 mb-8">
              <p className="font-bold text-indigo-800 dark:text-indigo-300 mb-3 text-sm uppercase tracking-wider">💡 Tips for best results</p>
              <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                <li>• Answer in full sentences like you would in a real interview</li>
                <li>• Mention specific examples, technologies, or projects you've worked on</li>
                <li>• Don't rush — take a moment to structure your answer before typing</li>
                <li>• Your answer is evaluated on accuracy, depth, and communication</li>
              </ul>
            </div>

            <button
              onClick={startInterview}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-lg py-5 rounded-2xl transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-3"
              id="interview-start-btn"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Connecting to AI interviewer...</>
              ) : (
                <><FiMic size={20} /> Start Mock Interview</>
              )}
            </button>
          </div>
        )}

        {/* ─── ACTIVE INTERVIEW ─── */}
        {phase === "active" && (
          <div>
            {/* Progress header */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-4 mb-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                  <FiMic className="text-indigo-600 dark:text-indigo-400" size={14} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-white text-sm">AI Mock Interview</p>
                  <p className="text-xs text-gray-400">Question {questionNumber} of {TOTAL_QUESTIONS}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < questionNumber - 1 ? "bg-indigo-500" : i === questionNumber - 1 ? "bg-indigo-400 animate-pulse" : "bg-gray-200 dark:bg-gray-700"
                  }`} />
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm mb-4">
              <div className="h-96 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${
                      msg.role === "ai" ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }`}>
                      {msg.role === "ai" ? <FiMonitor size={14} /> : <FiUser size={14} />}
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "ai"
                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-gray-800 dark:text-gray-100 rounded-tl-sm"
                        : "bg-gray-900 dark:bg-gray-600 text-white rounded-tr-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Loading bubble */}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <FiMonitor className="text-indigo-600" size={14} />
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/40 px-4 py-3 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map(d => (
                          <div key={d} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Evaluation pill */}
              {lastEval && (
                <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${lastEval.score >= 7 ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-600"}`}>
                    {lastEval.score >= 7 ? <FiCheckCircle size={14} /> : <FiTrendingUp size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Answer Feedback</p>
                      <ScoreBar score={lastEval.score} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{lastEval.feedback}</p>
                  </div>
                </div>
              )}

              {/* Input area */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
                  placeholder="Type your answer here... (Enter to submit, Shift+Enter for new line)"
                  rows={3}
                  disabled={loading}
                  className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  id="interview-answer-input"
                />
                <button
                  onClick={submitAnswer}
                  disabled={loading || !userInput.trim()}
                  className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-40 self-end flex items-center gap-2 font-bold py-3"
                  id="interview-submit-btn"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── SUMMARY ─── */}
        {phase === "summary" && summary && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score header */}
            <div className={`border-2 rounded-3xl p-8 mb-6 text-center ${gradeColors[summary.grade] || "bg-gray-50 border-gray-200 text-gray-700"}`}>
              <p className="text-5xl mb-3">
                {summary.avgScore >= 80 ? "🏆" : summary.avgScore >= 65 ? "🎯" : summary.avgScore >= 50 ? "📈" : "💪"}
              </p>
              <h2 className="text-3xl font-extrabold mb-1">{summary.grade}</h2>
              <p className="text-5xl font-black my-3">{summary.avgScore}%</p>
              <p className="text-sm font-medium opacity-80">Overall Interview Score</p>
              {xpEarned > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-bold border border-yellow-200">
                  <FiAward /> +{xpEarned} XP Earned
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <FiMonitor className="text-indigo-500" /> Interviewer's Assessment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{summary.summary}</p>
            </div>

            {/* Per-question scores */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white mb-4">Question Breakdown</h3>
              <div className="space-y-4">
                {summary.evaluations.map((ev, i) => (
                  <div key={i} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Question {i + 1}</span>
                      <ScoreBar score={ev.score} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{ev.feedback}</p>
                    <div className="flex gap-4 text-xs">
                      <span className="text-emerald-600 font-semibold">✓ {ev.strength}</span>
                      <span className="text-amber-600 font-semibold">↑ {ev.improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={reset}
                className="flex-1 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                id="interview-retry-btn"
              >
                <FiRefreshCw size={16} /> New Interview
              </button>
              <a
                href="/dashboard"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-center transition flex items-center justify-center gap-2"
              >
                <FiTrendingUp size={16} /> Back to Dashboard
              </a>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
