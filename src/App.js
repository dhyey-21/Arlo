import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./pages/AuthForm";
import MainPage from "./pages/MainPage";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { authService } from "./services/authService";
import TestAnimations from './test/TestAnimations';

// Wrapper component to handle location changes
const AppContent = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    console.log("App mounted, checking user:", user);
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setLoggedIn(false);
    toast.info("Logged out successfully");
  };

  return (
    <div className="app-container">
      <ErrorBoundary>
        <Navbar loggedIn={loggedIn} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? (
                <MainPage setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate to="/" />
              ) : (
                <AuthForm setLoggedIn={setLoggedIn} />
              )
            }
          />
          <Route
            path="/history"
            element={
              loggedIn ? <History /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/test"
            element={<TestAnimations />}
          />
        </Routes>
      </ErrorBoundary>
      <ToastContainer position="top-right" />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
