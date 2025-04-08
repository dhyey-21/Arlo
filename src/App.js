import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./pages/AuthForm";
import MainPage from "./pages/MainPage";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { authService } from "./services/authService";

// Wrapper component to handle location changes
const AppContent = () => {
  const location = useLocation();
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
      {loggedIn && (
        <Navbar handleLogout={handleLogout} isConnected={isConnected} />
      )}
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
        <Route
          path="/history"
          element={loggedIn ? <History /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
