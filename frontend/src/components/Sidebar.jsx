import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiMap, FiAward, FiFileText, FiPlusSquare,
  FiThumbsUp, FiBriefcase, FiClock, FiActivity, FiTrendingUp,
  FiZap, FiMic, FiMenu, FiX, FiChevronRight
} from "react-icons/fi";

const LINKS = [
  { icon: FiHome,       name: "Dashboard",       href: "/dashboard",      group: "main" },
  { icon: FiTrendingUp, name: "Progress",         href: "/progress",       group: "main" },
  { icon: FiClock,      name: "Focus Mode",       href: "/focus",          group: "main" },
  { icon: FiActivity,   name: "Sessions",         href: "/sessions",       group: "main" },
  { icon: FiMap,        name: "Roadmap",          href: "/roadmap",        group: "learn" },
  { icon: FiAward,      name: "Leaderboard",      href: "/leaderboard",    group: "learn" },
  { icon: FiFileText,   name: "Report",           href: "/report",         group: "learn" },
  { icon: FiPlusSquare, name: "Add Skill",        href: "/add-skill",      group: "practice" },
  { icon: FiZap,        name: "Skill Quiz",       href: "/quiz",           group: "practice" },
  { icon: FiMic,        name: "Mock Interview",   href: "/interview",      group: "practice" },
  { icon: FiThumbsUp,   name: "Recommendations",  href: "/recommendation", group: "practice" },
  { icon: FiBriefcase,  name: "Resume",           href: "/resume",         group: "career" },
];

const GROUP_LABELS = {
  main:     "Overview",
  learn:    "Learn",
  practice: "Practice",
  career:   "Career",
};

function NavLink({ link, active, collapsed, onClick }) {
  const Icon = link.icon;
  return (
    <a
      href={link.href}
      onClick={onClick}
      title={collapsed ? link.name : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
        active
          ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60"
      }`}
    >
      <Icon
        size={17}
        className={`flex-shrink-0 ${active ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-indigo-500 transition-colors"}`}
      />
      {!collapsed && (
        <span className="truncate">{link.name}</span>
      )}
      {active && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
      )}
      {/* Tooltip for collapsed mode */}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {link.name}
        </div>
      )}
    </a>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const groups = [...new Set(LINKS.map(l => l.group))];

  const SidebarContent = ({ onNavClick }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0 shadow-sm">
              S
            </div>
            <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">StudentTwin</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
            S
          </div>
        )}
        {/* Collapse toggle — only on desktop */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={15} /> : <FiMenu size={15} />}
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden">
        {groups.map(group => (
          <div key={group}>
            {!collapsed && (
              <p className="text-[10px] font-extrabold text-gray-300 dark:text-gray-600 uppercase tracking-widest px-3 mb-1.5">
                {GROUP_LABELS[group]}
              </p>
            )}
            <ul className="space-y-0.5">
              {LINKS.filter(l => l.group === group).map(link => (
                <li key={link.name}>
                  <NavLink
                    link={link}
                    active={path === link.href}
                    collapsed={collapsed}
                    onClick={onNavClick}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-[10px] text-gray-300 dark:text-gray-600 font-medium text-center">
            StudentTwin · AI-powered learning
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Mobile hamburger (only visible on small screens) ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md text-gray-700 dark:text-gray-300"
        id="sidebar-mobile-open"
        aria-label="Open navigation"
      >
        <FiMenu size={18} />
      </button>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-5 shadow-2xl transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          id="sidebar-mobile-close"
        >
          <FiX size={18} />
        </button>
        <SidebarContent onNavClick={() => setMobileOpen(false)} />
      </div>

      {/* ── Desktop sidebar ── */}
      <div className={`hidden lg:flex flex-col flex-shrink-0 bg-white dark:bg-[#0A0A0A] border-r border-gray-100 dark:border-gray-800 transition-all duration-300 z-20 p-5 ${collapsed ? "w-[68px]" : "w-60"}`}>
        <SidebarContent onNavClick={undefined} />
      </div>
    </>
  );
}
