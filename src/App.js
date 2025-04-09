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
import AnimationTest from './components/AnimationTest';
import AnimationEffectsTest from "./components/AnimationEffectsTest";
import MessageTest from './components/MessageTest';

// Wrapper component to handle location changes
const AppContent = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    console.log("App mounted, checking user:", user);
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    console.log("Handling logout");
    authService.logout();
    setLoggedIn(false);
    setIsConnected(false);
    toast.success("Successfully logged out");
  };

  return (
    <div className="app-container">
      {loggedIn && (
        <Navbar handleLogout={handleLogout} isConnected={isConnected} />
      )}
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              !loggedIn ? (
                <AuthForm setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !loggedIn ? (
                <AuthForm setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />
          <Route
            path="/home"
            element={
              loggedIn ? (
                <MainPage setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/test" element={<AnimationTest />} />
          <Route
            path="/history"
            element={loggedIn ? <History /> : <Navigate to="/" replace />}
          />
          <Route path="/effects" element={<AnimationEffectsTest />} />
          <Route path="/message-test" element={<MessageTest />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppContent />
    </Router>
  );
}

export default App;
