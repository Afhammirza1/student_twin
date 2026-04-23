import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiSearch, FiLogOut, FiX } from "react-icons/fi";
import NotificationBell from "./NotificationBell";

// Searchable pages list
const PAGES = [
  { label: "Dashboard",      href: "/dashboard",      keywords: ["home", "overview", "stats", "xp"] },
  { label: "Add Skill",      href: "/add-skill",      keywords: ["skill", "add", "register", "competency"] },
  { label: "Roadmap",        href: "/roadmap",        keywords: ["roadmap", "learning", "path", "career"] },
  { label: "Leaderboard",    href: "/leaderboard",    keywords: ["rank", "top", "leaderboard", "position"] },
  { label: "Report",         href: "/report",         keywords: ["report", "weekly", "analysis"] },
  { label: "Recommendations",href: "/recommendation", keywords: ["recommendation", "suggest", "improve"] },
  { label: "Skill Quiz",     href: "/quiz",           keywords: ["quiz", "test", "question", "mcq"] },
  { label: "Mock Interview", href: "/interview",      keywords: ["interview", "mock", "practice"] },
  { label: "Focus Mode",     href: "/focus",          keywords: ["focus", "pomodoro", "timer", "study"] },
  { label: "Sessions",       href: "/sessions",       keywords: ["session", "history", "activity"] },
  { label: "Progress",       href: "/progress",       keywords: ["progress", "chart", "trend", "score"] },
  { label: "Resume",         href: "/resume",         keywords: ["resume", "cv", "portfolio", "print"] },
];

export default function Topbar() {
  const navigate = useNavigate();

  // ── Dark mode ──────────────────────────────────────────────
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // ── User ───────────────────────────────────────────────────
  const userEmail = localStorage.getItem("userEmail") || "";
  const userInitial = userEmail ? userEmail[0].toUpperCase() : "U";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // ── Search ─────────────────────────────────────────────────
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const results = query.trim().length > 0
    ? PAGES.filter(p =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.keywords.some(k => k.includes(query.toLowerCase()))
      )
    : [];

  const handleSelect = (href) => {
    setQuery("");
    setShowResults(false);
    navigate(href);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 lg:px-8 py-3.5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-30 sticky top-0">

      {/* Search */}
      <div className="relative w-full max-w-sm lg:max-w-md ml-10 lg:ml-0" ref={searchRef}>
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
        <input
          id="topbar-search"
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none pl-9 pr-9 py-2.5 rounded-xl text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
          placeholder="Search pages… (Dashboard, Quiz…)"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          onKeyDown={e => {
            if (e.key === "Escape") { setQuery(""); setShowResults(false); }
            if (e.key === "Enter" && results.length > 0) handleSelect(results[0].href);
          }}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setShowResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX size={14} />
          </button>
        )}

        {/* Dropdown results */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in">
            {results.map((r, i) => (
              <button
                key={r.href}
                onClick={() => handleSelect(r.href)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0"
              >
                <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                  {r.label[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{r.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{r.href}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {showResults && query.trim().length > 0 && results.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 text-center z-50">
            <p className="text-sm text-gray-400 dark:text-gray-500">No pages found for "{query}"</p>
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <NotificationBell />

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark(d => !d)}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle dark mode"
          id="topbar-theme-toggle"
          title={dark ? "Switch to Light" : "Switch to Dark"}
        >
          {dark
            ? <FiSun size={18} className="text-amber-400" />
            : <FiMoon size={18} />
          }
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          title="Logout"
          id="topbar-logout-btn"
        >
          <FiLogOut size={17} />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm cursor-default select-none"
          title={userEmail}
        >
          {userInitial}
        </div>
      </div>
    </div>
  );
}
