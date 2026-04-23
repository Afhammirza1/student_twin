import { useState } from "react";
import { loginUser, registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userEmail", email);
      // Check if onboarding done — skip wizard for returning users
      const onboardingDone = localStorage.getItem("onboardingDone");
      navigate(onboardingDone ? "/dashboard" : "/onboarding");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  const signup = async () => {
    if (!email || !password || !name) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password });
      // Auto-login after signup then send to onboarding
      if (res.data?.data?.token) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("userEmail", email);
        toast.success("Account created! Let's set up your profile.");
        navigate("/onboarding");
      } else {
        toast.success("Account created! Please login.");
        setIsSignup(false);
        setEmail(""); setPassword(""); setName("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all text-gray-800 font-medium";
  const btnCls = "w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3.5 rounded-xl font-extrabold transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 mb-4 disabled:opacity-60 disabled:translate-y-0";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900">
      {/* Ambient glow */}
      <div className="absolute w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none top-1/4 left-1/4" />
      <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none bottom-1/4 right-1/4" />

      <div className="relative bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 mx-4">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">StudentTwin</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Your AI-powered learning companion</p>
        </div>

        {!isSignup ? (
          <>
            <h2 className="text-xl font-bold text-gray-700 mb-5 text-center">Welcome back</h2>
            <input id="login-email" className={inputCls} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
            <input id="login-password" className={inputCls} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
            <button id="login-btn" className={btnCls} onClick={login} disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
            <p className="text-center text-gray-500 text-sm">
              No account?{" "}
              <span className="text-indigo-600 cursor-pointer font-bold hover:text-indigo-800 transition-colors" onClick={() => { setIsSignup(true); setEmail(""); setPassword(""); }}>
                Create one free
              </span>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-700 mb-5 text-center">Create your account</h2>
            <input id="signup-name" className={inputCls} type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
            <input id="signup-email" className={inputCls} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input id="signup-password" className={inputCls} type="password" placeholder="Choose a password" value={password} onChange={e => setPassword(e.target.value)} />
            <button id="signup-btn" className={btnCls} onClick={signup} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <span className="text-indigo-600 cursor-pointer font-bold hover:text-indigo-800 transition-colors" onClick={() => { setIsSignup(false); setEmail(""); setPassword(""); }}>
                Sign in
              </span>
            </p>
          </>
        )}

        <p className="text-center text-[11px] text-gray-300 mt-5">Built with AI • Skill tracking • Career growth</p>
      </div>
    </div>
  );
}

export default Login;