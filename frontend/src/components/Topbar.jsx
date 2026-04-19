import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiSearch } from "react-icons/fi";

export default function Topbar() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md px-8 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-10 sticky top-0">
      
      <div className="relative w-full max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 outline-none pl-10 pr-4 py-2 rounded-lg text-sm placeholder-gray-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-sm"
          placeholder="Search items, collections, and users..."
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setDark(!dark)}
          className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Toggle Dark Mode"
        >
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
          A
        </div>
      </div>

    </div>
  );
}
