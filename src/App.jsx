import React from "react";
import Loginpage from "./components/Loginpage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignupPage from "./components/SignUppage";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import styles for Toastify
import HomePage from "./components/HomePage";
import Timer from "./components/Timer";
import "bootstrap/dist/css/bootstrap.css";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Attendence from "./components/Attendence";
import Documents from "./components/Documents";
import Game from "./components/Games";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<ProtectedRoute component={HomePage} />} />
        <Route path="/timer" element={<ProtectedRoute component={Timer} />} />
        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/attendence" element={<ProtectedRoute component={Attendence} />} />
        <Route path="/documents" element={<ProtectedRoute component={Documents} />} />
        <Route path="/games" element={<ProtectedRoute component={Game} />} />
        <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
