import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { FiPlay, FiPause, FiRefreshCw, FiAward, FiCoffee, FiZap, FiCheck } from "react-icons/fi";
import API from "../services/api";
import toast from "react-hot-toast";

const MODES = [
  { id: "focus",       label: "Focus",       duration: 25 * 60, icon: FiZap,      color: "indigo", desc: "Deep work session" },
  { id: "short",       label: "Short Break",  duration:  5 * 60, icon: FiCoffee,   color: "emerald", desc: "Quick recharge" },
  { id: "long",        label: "Long Break",   duration: 15 * 60, icon: FiCoffee,   color: "teal",    desc: "Stretch & relax" },
  { id: "sprint",      label: "Sprint",       duration: 10 * 60, icon: FiPlay,     color: "amber",   desc: "Quick task blitz" },
];

const COLOR = {
  indigo:  { ring: "border-indigo-500", text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-600",  activeTab: "bg-indigo-600 text-white shadow" },
  emerald: { ring: "border-emerald-500",text: "text-emerald-600 dark:text-emerald-400",bg: "bg-emerald-500", activeTab: "bg-emerald-600 text-white shadow" },
  teal:    { ring: "border-teal-500",   text: "text-teal-600 dark:text-teal-400",   bg: "bg-teal-500",    activeTab: "bg-teal-600 text-white shadow" },
  amber:   { ring: "border-amber-500",  text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500",   activeTab: "bg-amber-600 text-white shadow" },
};

export default function FocusMode() {
  const [mode, setMode]         = useState(MODES[0]);
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sessions, setSessions]   = useState(0); // completed focus sessions this run
  const audioRef = useRef(null);

  // Reset when mode changes
  const switchMode = (m) => {
    setIsRunning(false);
    setCompleted(false);
    setMode(m);
    setTimeLeft(m.duration);
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleComplete();
    }
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  const handleComplete = async () => {
    setCompleted(true);
    // Play a soft chime via the Web Audio API
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 528;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {}

    if (mode.id === "focus") {
      setSessions(s => s + 1);
      try {
        const res = await API.post("/gamification/focus");
        toast.success(res.data.message || "Focus session complete! +15 XP 🔥");
      } catch (err) { console.error(err); }
    } else {
      toast.success(`${mode.label} complete! Time to focus again. ☕`);
    }
  };

  const toggle  = () => setIsRunning(r => !r);
  const reset   = () => { setIsRunning(false); setTimeLeft(mode.duration); setCompleted(false); };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const c = COLOR[mode.color];
  const pct = ((mode.duration - timeLeft) / mode.duration) * 100;
  const circumference = 2 * Math.PI * 88; // r=88

  return (
    <Layout>
      <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Deep Work Zone</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Complete focus sessions to earn XP and build momentum.</p>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1.5 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl mb-8">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => switchMode(m)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-xl text-xs font-bold transition-all ${
                mode.id === m.id
                  ? COLOR[m.color].activeTab
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              id={`focus-mode-${m.id}`}
            >
              <m.icon size={14} />
              {m.label}
            </button>
          ))}
        </div>

        {/* Timer card */}
        <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 ${c.ring} transition-colors duration-500 p-8 relative overflow-hidden`}>
          {/* Completion banner */}
          {completed && (
            <div className={`absolute top-0 left-0 right-0 ${c.bg} text-white py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-bold animate-in slide-in-from-top-2 duration-300`}>
              <FiCheck size={16} />
              {mode.id === "focus" ? "Focus XP Awarded! 🔥" : `${mode.label} done!`}
            </div>
          )}

          {/* SVG circular progress */}
          <div className="flex flex-col items-center py-4">
            <div className="relative w-52 h-52 mb-6">
              <svg className="rotate-[-90deg] w-full h-full" viewBox="0 0 200 200">
                {/* Track */}
                <circle cx="100" cy="100" r="88" fill="none" strokeWidth="8" className="stroke-gray-100 dark:stroke-gray-700" />
                {/* Progress */}
                <circle
                  cx="100" cy="100" r="88" fill="none" strokeWidth="8" strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    mode.color === "indigo"  ? "stroke-indigo-500" :
                    mode.color === "emerald" ? "stroke-emerald-500" :
                    mode.color === "teal"    ? "stroke-teal-500" :
                    "stroke-amber-500"
                  }`}
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - pct / 100)}
                />
              </svg>
              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black tabular-nums ${c.text}`}>
                  {formatTime(timeLeft)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-bold mt-1 uppercase tracking-widest">
                  {mode.desc}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 transition"
                title="Reset"
                id="focus-reset-btn"
              >
                <FiRefreshCw size={18} />
              </button>
              <button
                onClick={toggle}
                className={`flex items-center gap-2.5 px-8 py-4 rounded-2xl font-extrabold text-white transition-all shadow-lg hover:-translate-y-0.5 ${c.bg} hover:opacity-90`}
                id="focus-toggle-btn"
              >
                {isRunning ? <><FiPause size={18} /> Pause</> : <><FiPlay size={18} /> {timeLeft === mode.duration ? "Start" : "Resume"}</>}
              </button>
              {sessions > 0 && (
                <div className="w-12 h-12 flex flex-col items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-100 dark:border-indigo-800">
                  <FiAward className="text-indigo-500" size={14} />
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{sessions}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { emoji: "📵", tip: "Phone away" },
            { emoji: "🎧", tip: "Use lo-fi music" },
            { emoji: "💧", tip: "Stay hydrated" },
          ].map(t => (
            <div key={t.tip} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 text-center">
              <div className="text-xl mb-1">{t.emoji}</div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{t.tip}</p>
            </div>
          ))}
        </div>

        {/* Session counter */}
        {sessions > 0 && (
          <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4 text-center animate-in fade-in duration-300">
            <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              🔥 {sessions} session{sessions > 1 ? "s" : ""} complete today · {sessions * 15} XP earned
            </p>
            {sessions >= 4 && (
              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">Deep work master! Take a proper break. 🏆</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
