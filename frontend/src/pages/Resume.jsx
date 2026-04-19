import { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { 
  FiSave, FiUser, FiBriefcase, FiMail, FiPhone, FiBook, 
  FiCode, FiDownload, FiGithub, FiLinkedin, FiAlignLeft,
  FiTarget, FiAward, FiLayout, FiPlus, FiTrash2, FiCalendar,
  FiZap
} from "react-icons/fi";
import Layout from "../components/Layout";

export default function Resume() {
  const [skills, setSkills] = useState([]);
  const [activeTab, setActiveTab] = useState("personal");

  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    summary: "",
    themeColor: "indigo",
    experiences: [],
    educations: [],
    projects: []
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("skills")) || [];
    setSkills(data);

    const saved = JSON.parse(localStorage.getItem("resume_v2")) || JSON.parse(localStorage.getItem("resume")) || {};
    
    // Migration from old text-based format if needed, or default empties
    setForm(prev => ({ 
      ...prev, 
      ...saved,
      experiences: saved.experiences || (saved.experience ? [{ id: Date.now(), title: "Previous Role", company: "Company", date: "Year", desc: saved.experience }] : []),
      educations: saved.educations || (saved.education ? [{ id: Date.now()+1, degree: saved.education, school: "University", date: "Year" }] : []),
      projects: saved.projects || (saved.project ? [{ id: Date.now()+2, name: "Notable Project", tech: "Tech Stack", desc: saved.project }] : [])
    }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field, id, key, value) => {
    const updated = form[field].map(item => item.id === id ? { ...item, [key]: value } : item);
    setForm({ ...form, [field]: updated });
  };

  const addItem = (field, defaultItem) => {
    setForm({ ...form, [field]: [...form[field], { id: Date.now(), ...defaultItem }] });
  };

  const removeItem = (field, id) => {
    setForm({ ...form, [field]: form[field].filter(item => item.id !== id) });
  };

  const setAppTheme = (color) => {
    setForm({ ...form, themeColor: color });
  };

  const saveResume = () => {
    localStorage.setItem("resume_v2", JSON.stringify(form));
    alert("✅ Resume Saved Successfully!");
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${form.name || "Student"}_Resume`,
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print { 
        body { -webkit-print-color-adjust: exact; background: transparent !important; } 
        .print-break-inside-avoid { break-inside: avoid; }
        .no-print-shadow { box-shadow: none !important; }
      }
    `
  });

  const themeColors = {
    indigo: { bg: "bg-indigo-600", text: "text-indigo-600", light: "bg-indigo-50", border: "border-indigo-600", gradient: "from-indigo-600 to-indigo-800" },
    emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-600", gradient: "from-emerald-600 to-emerald-800" },
    rose: { bg: "bg-rose-600", text: "text-rose-600", light: "bg-rose-50", border: "border-rose-600", gradient: "from-rose-600 to-rose-800" },
    slate: { bg: "bg-slate-800", text: "text-slate-800", light: "bg-slate-100", border: "border-slate-800", gradient: "from-slate-700 to-slate-900" },
    amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-500", gradient: "from-amber-400 to-amber-600" },
  };

  const currentTheme = themeColors[form.themeColor] || themeColors.indigo;

  const InputField = ({ label, name, icon: Icon, placeholder, isTextarea, value, onChange }) => (
    <div className="group">
      <label className="text-xs font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2 mb-2 group-focus-within:text-indigo-600 transition-colors">
        {Icon && <Icon className="text-sm" />} {label}
      </label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value !== undefined ? value : form[name]}
          onChange={onChange || handleChange}
          placeholder={placeholder}
          className="w-full p-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium min-h-[120px] resize-y shadow-sm"
        />
      ) : (
        <input
          name={name}
          value={value !== undefined ? value : form[name]}
          onChange={onChange || handleChange}
          placeholder={placeholder}
          className="w-full p-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium shadow-sm"
        />
      )}
    </div>
  );

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1500px] mx-auto pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-widest mb-3 border border-indigo-100">
              <FiZap className="text-amber-500" /> RESUME BUILDER PRO
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
              Design Your Career
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={saveResume} className="px-6 py-3 bg-white text-gray-700 hover:text-indigo-600 font-bold rounded-xl shadow-sm border border-gray-200 hover:border-indigo-200 transition-all flex items-center gap-2">
              <FiSave /> Save Draft
            </button>
            <button onClick={handlePrint} className={`px-6 py-3 bg-gradient-to-r ${currentTheme.gradient} text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-xl`}>
              <FiDownload /> Export High-Res PDF
            </button>
          </div>
        </div>

        <div className="flex flex-col 2xl:flex-row gap-10 items-start">
          
          {/* LEFT SIDE - ENHANCED EDITOR */}
          <div className="w-full 2xl:w-5/12 bg-white/70 backdrop-blur-3xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60 flex-shrink-0 sticky top-24 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 p-2 bg-white/50 z-10">
              {[
                { id: "personal", icon: FiUser, label: "Profile" },
                { id: "professional", icon: FiBriefcase, label: "Experience" },
                { id: "education", icon: FiBook, label: "Edu & Proj" },
                { id: "style", icon: FiLayout, label: "Styling" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 md:px-4 flex items-center justify-center gap-2 font-bold text-[11px] md:text-sm rounded-xl transition-all ${
                    activeTab === tab.id ? `${currentTheme.light} ${currentTheme.text} shadow-sm` : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/80"
                  }`}
                >
                  <tab.icon className="hidden md:block" /> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 relative">
              
              {activeTab === "personal" && (
                <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField name="name" label="Full Name" icon={FiUser} placeholder="Jane Doe" />
                    <InputField name="role" label="Target Role" icon={FiTarget} placeholder="Software Engineer" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField name="email" label="Email" icon={FiMail} placeholder="jane@example.com" />
                    <InputField name="phone" label="Phone" icon={FiPhone} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField name="github" label="GitHub" icon={FiGithub} placeholder="github.com/username" />
                    <InputField name="linkedin" label="LinkedIn" icon={FiLinkedin} placeholder="linkedin.com/in/username" />
                  </div>
                  <InputField name="summary" label="Professional Summary" icon={FiAlignLeft} placeholder="A passionate developer with..." isTextarea />
                </div>
              )}

              {activeTab === "professional" && (
                <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <h3 className="font-extrabold text-gray-900">Work History</h3>
                      <p className="text-xs text-gray-500">Add relevant roles.</p>
                    </div>
                    <button 
                      onClick={() => addItem("experiences", { title: "", company: "", date: "", desc: "" })}
                      className={`p-2.5 rounded-xl ${currentTheme.bg} text-white hover:opacity-90 transition-all flex items-center gap-2 text-sm font-bold shadow-sm`}
                    >
                      <FiPlus /> Add Role
                    </button>
                  </div>

                  <div className="space-y-6">
                    {form.experiences.map((exp, i) => (
                      <div key={exp.id} className="relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                        <button onClick={() => removeItem("experiences", exp.id)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <FiTrash2 />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                          <InputField value={exp.title} onChange={e => handleArrayChange("experiences", exp.id, "title", e.target.value)} label="Job Title" placeholder="Senior Developer" />
                          <InputField value={exp.company} onChange={e => handleArrayChange("experiences", exp.id, "company", e.target.value)} label="Company" placeholder="TechCorp" />
                        </div>
                        <InputField value={exp.date} onChange={e => handleArrayChange("experiences", exp.id, "date", e.target.value)} label="Time Period" icon={FiCalendar} placeholder="Jan 2022 - Present" />
                        <div className="mt-4">
                          <InputField value={exp.desc} onChange={e => handleArrayChange("experiences", exp.id, "desc", e.target.value)} label="Description & Highlights" placeholder="- Led a team of 4...&#10;- Improved latency by 30%..." isTextarea />
                        </div>
                      </div>
                    ))}
                    {form.experiences.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl">
                        <p className="text-gray-400 font-medium">No experience added yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-10 animate-in slide-in-from-left-4 duration-500">
                  {/* EDUCATION SECTION */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <h3 className="font-extrabold text-gray-900">Education</h3>
                      </div>
                      <button onClick={() => addItem("educations", { degree: "", school: "", date: "" })} className={`p-2 rounded-xl ${currentTheme.bg} text-white hover:opacity-90 transition-all`}>
                        <FiPlus />
                      </button>
                    </div>
                    {form.educations.map((item) => (
                      <div key={item.id} className="relative p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                        <button onClick={() => removeItem("educations", item.id)} className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                          <FiTrash2 />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-6">
                          <InputField value={item.degree} onChange={e => handleArrayChange("educations", item.id, "degree", e.target.value)} label="Degree / Course" placeholder="B.S. Comp Sci" />
                          <InputField value={item.school} onChange={e => handleArrayChange("educations", item.id, "school", e.target.value)} label="Institution" placeholder="State University" />
                        </div>
                        <InputField value={item.date} onChange={e => handleArrayChange("educations", item.id, "date", e.target.value)} label="Date" placeholder="2018 - 2022" />
                      </div>
                    ))}
                  </div>

                  <hr className="border-gray-100" />

                  {/* PROJECTS SECTION */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <h3 className="font-extrabold text-gray-900">Projects</h3>
                      </div>
                      <button onClick={() => addItem("projects", { name: "", tech: "", desc: "" })} className={`p-2 rounded-xl ${currentTheme.bg} text-white hover:opacity-90 transition-all`}>
                        <FiPlus />
                      </button>
                    </div>
                    {form.projects.map((item) => (
                      <div key={item.id} className="relative p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                        <button onClick={() => removeItem("projects", item.id)} className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                          <FiTrash2 />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-6">
                          <InputField value={item.name} onChange={e => handleArrayChange("projects", item.id, "name", e.target.value)} label="Project Name" placeholder="E-commerce App" />
                          <InputField value={item.tech} onChange={e => handleArrayChange("projects", item.id, "tech", e.target.value)} label="Core Technologies" placeholder="React, Node, MongoDB" />
                        </div>
                        <InputField value={item.desc} onChange={e => handleArrayChange("projects", item.id, "desc", e.target.value)} label="Details" placeholder="- Architected the scalable backend..." isTextarea />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "style" && (
                <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                  <div>
                    <label className="text-base font-black text-gray-900 mb-6 block">Choose Accent Color</label>
                    <div className="flex flex-wrap gap-5">
                      {Object.keys(themeColors).map(color => (
                        <button
                          key={color}
                          onClick={() => setAppTheme(color)}
                          className={`w-14 h-14 rounded-2xl cursor-pointer transition-all flex items-center justify-center ${
                            form.themeColor === color ? 'ring-4 ring-offset-4 ring-gray-200 scale-110 shadow-lg' : 'hover:scale-110 shadow-md border border-gray-200/50'
                          }`}
                          style={{ backgroundColor: color === 'indigo' ? '#4f46e5' : color === 'emerald' ? '#059669' : color === 'rose' ? '#e11d48' : color === 'slate' ? '#1e293b' : '#f59e0b' }}
                        >
                          {form.themeColor === color && <FiLayout className="text-white text-xl" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-6 ${currentTheme.light} rounded-2xl border ${currentTheme.border} border-opacity-30 flex items-start gap-4`}>
                    <div className={`p-3 bg-white rounded-xl ${currentTheme.text} shadow-sm`}><FiAward className="text-xl" /></div>
                    <div>
                      <h4 className={`font-bold ${currentTheme.text} mb-1`}>Automatic Skill Syncing</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">Levels and skills from your Add Skill page are instantly formatted for the best visual presentation automatically.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE - PREMIUM PREVIEW */}
          <div className="w-full 2xl:w-7/12 flex flex-col items-center">
            
            <div 
              ref={componentRef} 
              className="bg-white rounded-none md:rounded-lg overflow-hidden w-full max-w-[210mm] min-h-[297mm] flex flex-row no-print-shadow shadow-[0_20px_60px_-15px_rgb(0,0,0,0.1)] relative"
              style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
            >
              <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${currentTheme.gradient} z-50`}></div>
              
              {/* Left Sidebar (Dark Column) */}
              <div className="w-[33%] bg-slate-900 text-slate-300 flex flex-col print-break-inside-avoid relative">
                
                {/* Header Name Block */}
                <div className={`p-8 pb-10 text-white relative flex-shrink-0 z-10`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-90`}></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  
                  <h1 className="text-3xl font-black tracking-tight leading-none mb-3 relative z-10">{form.name || "Your Name"}</h1>
                  <h3 className="text-[13px] font-bold text-white/90 uppercase tracking-widest relative z-10">{form.role || "Professional Title"}</h3>
                </div>

                <div className="p-8 pb-12 flex flex-col gap-10 flex-1 relative z-10 -mt-4 bg-slate-900 rounded-t-3xl">
                  
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h2 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.25em] mb-4 border-b border-slate-800 pb-2 flex items-center gap-2"><FiUser/> Contact</h2>
                    {form.email && (
                      <div className="flex items-center gap-3 text-xs w-full">
                        <div className={`p-1.5 rounded-md bg-slate-800 ${currentTheme.text} flex-shrink-0`}><FiMail /></div>
                        <span className="break-all">{form.email}</span>
                      </div>
                    )}
                    {form.phone && (
                      <div className="flex items-center gap-3 text-xs w-full">
                        <div className={`p-1.5 rounded-md bg-slate-800 ${currentTheme.text} flex-shrink-0`}><FiPhone /></div>
                        <span>{form.phone}</span>
                      </div>
                    )}
                    {form.linkedin && (
                      <div className="flex items-center gap-3 text-xs w-full">
                        <div className={`p-1.5 rounded-md bg-slate-800 ${currentTheme.text} flex-shrink-0`}><FiLinkedin /></div>
                        <span className="truncate">{form.linkedin.replace("https://", "").replace("www.", "")}</span>
                      </div>
                    )}
                    {form.github && (
                      <div className="flex items-center gap-3 text-xs w-full">
                        <div className={`p-1.5 rounded-md bg-slate-800 ${currentTheme.text} flex-shrink-0`}><FiGithub /></div>
                        <span className="truncate">{form.github.replace("https://", "").replace("www.", "")}</span>
                      </div>
                    )}
                  </div>

                  {/* Education Sidebar */}
                  {form.educations.length > 0 && (
                    <div className="space-y-5">
                      <h2 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.25em] mb-4 border-b border-slate-800 pb-2 flex items-center gap-2"><FiBook/> Education</h2>
                      {form.educations.map((edu, idx) => (
                        <div key={idx} className="relative">
                          <h4 className="text-sm font-bold text-slate-100">{edu.degree}</h4>
                          <p className="text-xs text-slate-400 mt-1">{edu.school}</p>
                          <p className={`text-[10px] uppercase tracking-wider font-bold mt-1 ${currentTheme.text}`}>{edu.date}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  <div>
                    <h2 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.25em] mb-4 border-b border-slate-800 pb-2 flex items-center gap-2"><FiTarget/> Competencies</h2>
                    {skills.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {skills.slice(0, 8).map((s, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-end mb-1.5">
                              <span className="font-bold text-[13px] text-slate-200">{s.skill || s.skillName}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`${currentTheme.bg} h-full rounded-full opacity-90 relative`}
                                style={{ width: `${(s.level || 0) * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-600 italic">Configure skills via dashboard.</p>
                    )}
                  </div>

                </div>
              </div>

              {/* Right Main Content (Light Column) */}
              <div className="w-[67%] bg-white p-10 pt-12 flex flex-col gap-9 pb-12">
                
                {/* Summary */}
                {form.summary && (
                  <div className="animate-in fade-in">
                    <h2 className={`text-base font-black uppercase ${currentTheme.text} tracking-[0.1em] flex items-center gap-3 mb-4`}>
                       <span className={`w-8 h-px ${currentTheme.bg} inline-block`}></span> About Profile
                    </h2>
                    <p className="text-gray-700 text-[13px] leading-relaxed whitespace-pre-wrap font-medium pl-11">
                      {form.summary}
                    </p>
                  </div>
                )}

                {/* Experience with Timeline */}
                {form.experiences.length > 0 && (
                  <div>
                    <h2 className={`text-base font-black uppercase ${currentTheme.text} tracking-[0.1em] flex items-center gap-3 mb-8`}>
                       <span className={`w-8 h-px ${currentTheme.bg} inline-block`}></span> Work Experience
                    </h2>
                    
                    <div className="pl-11 space-y-8 relative">
                      {/* Timeline Line */}
                      <div className={`absolute left-[5.5px] top-2 bottom-0 w-px bg-gray-200`}></div>

                      {form.experiences.map((exp, idx) => (
                        <div key={idx} className="relative">
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[42px] top-1.5 w-3 h-3 rounded-full ${currentTheme.bg} ring-4 ring-white`}></div>
                          
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-base font-black text-gray-900">{exp.title}</h3>
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${currentTheme.text} bg-gray-50 px-2 py-0.5 rounded`}>{exp.date}</span>
                          </div>
                          <h4 className="text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-1.5">
                            <FiBriefcase className="text-[11px]"/> {exp.company}
                          </h4>
                          
                          <div className="text-gray-600 text-[13px] leading-relaxed whitespace-pre-wrap">
                            {exp.desc.split('\n').map((line, i) => {
                              const trimmed = line.trim();
                              if (!trimmed) return null;
                              const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•');
                              return (
                                <p key={i} className={`${isBullet ? 'pl-4 relative before:content-["•"] before:absolute before:left-0 before:text-gray-400 mb-1' : 'mb-2 font-medium text-gray-800'}`}>
                                  {trimmed.replace(/^[-•]\s*/, '')}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {form.projects.length > 0 && (
                  <div>
                    <h2 className={`text-base font-black uppercase ${currentTheme.text} tracking-[0.1em] flex items-center gap-3 mb-8`}>
                       <span className={`w-8 h-px ${currentTheme.bg} inline-block`}></span> Featured Projects
                    </h2>
                    
                    <div className="pl-11 grid grid-cols-1 gap-6">
                      {form.projects.map((proj, idx) => (
                        <div key={idx} className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 relative overflow-hidden group">
                           <div className={`absolute top-0 left-0 w-1 h-full ${currentTheme.bg} opacity-50`}></div>
                          
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-black text-gray-900">{proj.name}</h3>
                            {proj.tech && <span className="text-[10px] font-bold uppercase text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">{proj.tech}</span>}
                          </div>
                          
                          <div className="text-gray-600 text-[12px] leading-relaxed whitespace-pre-wrap">
                            {proj.desc.split('\n').map((line, i) => {
                              const trimmed = line.trim();
                              if (!trimmed) return null;
                              return (
                                <p key={i} className={`${trimmed.startsWith('-') ? 'pl-3 relative before:content-["•"] before:absolute before:-left-1 before:text-gray-400 mb-1' : 'mb-1'}`}>
                                  {trimmed.replace(/^[-•]\s*/, '')}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

