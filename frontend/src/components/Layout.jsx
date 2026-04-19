import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1 overflow-y-auto w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
