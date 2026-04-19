import { useState } from "react";
import { addSkill } from "../services/skill";
import { FiPlus, FiBriefcase, FiAward, FiStar } from "react-icons/fi";
import Layout from "../components/Layout";

function AddSkill() {
  const [form, setForm] = useState({
    skillName: "",
    level: 1,
    projects: 0,
    certifications: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addSkill(form);
      
      // Sync added skill to localStorage for Resume.jsx auto-import
      const existing = JSON.parse(localStorage.getItem("skills")) || [];
      localStorage.setItem("skills", JSON.stringify([
        ...existing, 
        { skillName: form.skillName, level: form.level }
      ]));

      alert("Skill added successfully!");
      setForm({ skillName: "", level: 1, projects: 0, certifications: 0 });
    } catch (err) {
      alert(err.response?.data?.message || "Error adding skill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3 flex items-center justify-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
              <FiPlus />
            </div>
            Register New Skill
          </h1>
          <p className="text-gray-500 font-medium">Add competencies to update your digital academic profile.</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-indigo-100/50 border border-indigo-50 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide">SKILL NAME (EX. REACT, JAVA)</label>
              <input
                required
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all font-medium text-gray-800"
                placeholder="E.g., Python"
                value={form.skillName}
                onChange={(e) => setForm({ ...form, skillName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide flex items-center gap-2">
                  <FiStar className="text-amber-500" /> MASTERY LEVEL (1-10)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  max="10"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-transparent transition-all font-medium text-gray-800"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: +e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide flex items-center gap-2">
                  <FiBriefcase className="text-blue-500" /> PROJECTS BUILT
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all font-medium text-gray-800"
                  value={form.projects}
                  onChange={(e) => setForm({ ...form, projects: +e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 tracking-wide flex items-center gap-2">
                <FiAward className="text-emerald-500" /> CERTIFICATIONS EARNED
              </label>
              <input
                required
                type="number"
                min="0"
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all font-medium text-gray-800"
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: +e.target.value })}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
              >
                {loading ? "Adding Skill Profile..." : "Save Competency Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AddSkill;