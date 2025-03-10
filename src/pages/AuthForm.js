import React, { useState } from "react";
import { toast } from "react-toastify";
import "../styles/AuthForm.css";

const AuthForm = ({ setLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoggedIn(true);
      setIsLoading(false);
    }, 1500);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <i className="mdi mdi-robot-excited"></i>
          <h1>Welcome to Arlo</h1>
          <p>Your Personal Voice Assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <i className="mdi mdi-email"></i>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <i className="mdi mdi-lock"></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <i className="mdi mdi-lock-check"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className={`login-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="mdi mdi-loading mdi-spin"></i>
            ) : (
              <>
                <i
                  className={`mdi ${
                    isLogin ? "mdi-login" : "mdi-account-plus"
                  }`}
                ></i>
                {isLogin ? "Login" : "Sign Up"}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin && (
            <a href="#" className="forgot-password">
              <i className="mdi mdi-help-circle"></i>
              Forgot Password?
            </a>
          )}
          <div className="auth-toggle">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button onClick={toggleForm} className="toggle-btn">
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Animated background */}
      <div className="cyber-grid">
        {Array(20)
          .fill()
          .map((_, i) => (
            <div key={i} className="grid-line"></div>
          ))}
      </div>
    </div>
  );
};

export default AuthForm;
