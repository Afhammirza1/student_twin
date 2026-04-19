import { useLocation } from "react-router-dom";
import { FiHome, FiMap, FiAward, FiFileText, FiPlusSquare, FiThumbsUp, FiBriefcase, FiClock } from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { icon: FiHome, name: "Dashboard", href: "/dashboard" },
    { icon: FiClock, name: "Focus Mode", href: "/focus" },
    { icon: FiMap, name: "Roadmap", href: "/roadmap" },
    { icon: FiAward, name: "Leaderboard", href: "/leaderboard" },
    { icon: FiFileText, name: "Report", href: "/report" },
    { icon: FiPlusSquare, name: "Add Skill", href: "/add-skill" },
    { icon: FiThumbsUp, name: "Recommendations", href: "/recommendation" },
    { icon: FiBriefcase, name: "Resume", href: "/resume" },
  ];

  return (
    <div className="w-64 bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-8 flex-shrink-0 z-20">
      <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
        <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
        </div>
        StudentTwin
      </h2>

      <ul className="space-y-1">
        {links.map((link) => {
          const active = path === link.href;
          const Icon = link.icon;
          return (
            <li key={link.name}>
              <a 
                href={link.href} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active 
                    ? "bg-gray-100 text-black dark:bg-gray-800 dark:text-white" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50"
                }`}
              >
                <Icon className={active ? "text-indigo-600 dark:text-indigo-400" : ""} size={18} />
                {link.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
