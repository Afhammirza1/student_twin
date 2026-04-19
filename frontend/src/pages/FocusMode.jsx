import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FiPlay, FiPause, FiRefreshCw, FiAward } from "react-icons/fi";
import API from "../services/api";

export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      handleComplete();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleComplete = async () => {
    setCompleted(true);
    try {
      const res = await API.post("/gamification/focus");
      alert(res.data.message || "You gained 15 XP!");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setCompleted(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Deep Work Zone</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mb-12">Complete a 25-minute Pomodoro session to earn XP.</p>

        <div className="bg-white dark:bg-[#0A0A0A] p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          {completed && (
            <div className="absolute top-0 left-0 w-full bg-green-500 text-white py-2 font-bold flex justify-center items-center gap-2">
              <FiAward /> Focus XP Awarded!
            </div>
          )}
          
          <div className="text-9xl font-black text-indigo-600 dark:text-indigo-400 mb-12 tracking-tighter tabular-nums drop-shadow-sm">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            <button 
              onClick={toggleTimer}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {isRunning ? <><FiPause /> Pause</> : <><FiPlay /> Start Focus</>}
            </button>
            <button 
              onClick={resetTimer}
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <FiRefreshCw /> Reset
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
