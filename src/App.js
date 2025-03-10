import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./pages/AuthForm";
import MainPage from "./pages/MainPage";
import Settings from "./pages/Settings";
import History from "./pages/History";
import Navbar from "./Components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
        />
        {loggedIn && <Navbar handleLogout={handleLogout} />}
        <Routes>
          <Route
            path="/login"
            element={
              !loggedIn ? (
                <AuthForm setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={loggedIn ? <Settings /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/history"
            element={loggedIn ? <History /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/*"
            element={
              loggedIn ? (
                <MainPage setLoggedIn={setLoggedIn} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
