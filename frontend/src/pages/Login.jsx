import { useState } from "react";
import { loginUser, registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // LOGIN
  const login = async () => {
    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userEmail", email);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // SIGNUP
  const signup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await registerUser({ name, email, password });

      alert("Signup Successful! Please Login");
      setIsSignup(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // FORGOT PASSWORD
  const resetPassword = () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || savedUser.email !== email) {
      alert("Email not found");
      return;
    }

    savedUser.password = newPassword;

    localStorage.setItem("user", JSON.stringify(savedUser));

    alert("Password Updated Successfully");
    setIsForgot(false);
    setEmail("");
    setNewPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-cyan-400">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>

        {!isSignup && !isForgot && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Login</h2>

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-colors mb-4"
              onClick={login}
            >
              Login
            </button>

            <p 
              className="text-blue-500 cursor-pointer hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsForgot(true)}
            >
              Forgot Password?
            </p>

            <p className="text-gray-600 mt-4">
              Don't have account?{" "}
              <span
                className="text-blue-500 cursor-pointer hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </span>
            </p>
          </>
        )}

        {isSignup && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Sign Up</h2>

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="password"
              placeholder="Create Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-colors mb-4"
              onClick={signup}
            >
              Create Account
            </button>

            <p 
              className="text-blue-500 cursor-pointer hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsSignup(false)}
            >
              Back to Login
            </p>
          </>
        )}

        {isForgot && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Reset Password</h2>

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              type="password"
              placeholder="Enter New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition-colors mb-4"
              onClick={resetPassword}
            >
              Update Password
            </button>

            <p 
              className="text-blue-500 cursor-pointer hover:text-blue-600 font-medium transition-colors"
              onClick={() => setIsForgot(false)}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;