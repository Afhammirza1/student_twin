import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddSkill from "./pages/AddSkill";
import Roadmap from "./pages/Roadmap";
import Resume from "./pages/Resume";
import Recommendation from "./pages/Recommendation";
import Report from "./pages/Report";
import PublicProfile from "./pages/PublicProfile";
import Leaderboard from "./pages/Leaderboard";
import FocusMode from "./pages/FocusMode";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:username" element={<PublicProfile />} />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/add-skill" element={
          <PrivateRoute><AddSkill /></PrivateRoute>
        } />

        <Route path="/roadmap" element={
          <PrivateRoute><Roadmap /></PrivateRoute>
        } />

        <Route path="/resume" element={
          <PrivateRoute><Resume /></PrivateRoute>
        } />

        <Route path="/recommendation" element={
          <PrivateRoute><Recommendation /></PrivateRoute>
        } />

        <Route path="/report" element={
          <PrivateRoute><Report /></PrivateRoute>
        } />

        <Route path="/leaderboard" element={
          <PrivateRoute><Leaderboard /></PrivateRoute>
        } />
        
        <Route path="/focus" element={
          <PrivateRoute><FocusMode /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
