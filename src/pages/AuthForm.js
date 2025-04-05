import React, { useState } from "react";
import { toast } from "react-toastify";
import "../styles/AuthForm.css";
import { authService } from "../services/authService";

const AuthForm = ({ setLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      console.log("Form submitted:", { isLogin, email });

      if (isLogin) {
        const result = await authService.login(email, password);
        console.log("Login result:", result);
        if (result.success) {
          toast.success("Successfully logged in!");
          setLoggedIn(true);
        }
      } else {
        const result = await authService.register(email, password);
        console.log("Registration result:", result);
        if (result.success) {
          toast.success("Successfully registered!");
          setLoggedIn(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`mdi ${showPassword ? "mdi-eye-off" : "mdi-eye"}`}
              ></i>
            </button>
          </div>

          {!isLogin && (
            <div className="input-group">
              <i className="mdi mdi-lock-check"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`mdi ${
                    showConfirmPassword ? "mdi-eye-off" : "mdi-eye"
                  }`}
                ></i>
              </button>
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
