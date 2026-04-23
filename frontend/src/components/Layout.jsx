import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#f8f9fc] dark:bg-[#0a0b0f] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        {/* lg:pl-0 ensures desktop sidebar occupies its own space */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-5 pt-5 pb-10 lg:px-8 lg:pt-8 w-full max-w-7xl mx-auto">
            {/* Mobile spacing for hamburger button */}
            <div className="h-2 lg:hidden" />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
