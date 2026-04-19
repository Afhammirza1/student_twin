import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-lg">
      <h3 className="font-bold text-xl cursor-pointer hover:text-indigo-200 transition-colors">
        Student Twin
      </h3>
      <div className="flex space-x-6">
        <Link 
          to="/dashboard" 
          className="hover:text-indigo-200 transition-colors font-medium"
        >
          Dashboard
        </Link>
        <Link 
          to="/roadmap" 
          className="hover:text-indigo-200 transition-colors font-medium"
        >
          Roadmap
        </Link>
        <Link 
          to="/recommendations" 
          className="hover:text-indigo-200 transition-colors font-medium bg-purple-600 px-3 py-1 rounded-full text-sm"
        >
          🤖 AI
        </Link>
        <Link 
          to="/report" 
          className="hover:text-indigo-200 transition-colors font-medium"
        >
          Report
        </Link>
        <Link 
          to="/add-skill" 
          className="hover:text-indigo-200 transition-colors font-medium"
        >
          Add Skill
        </Link>
        <Link 
          to="/resume" 
          className="hover:text-indigo-200 transition-colors font-medium"
        >
          Resume
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;