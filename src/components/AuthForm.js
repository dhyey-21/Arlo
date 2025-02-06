import React, { useState } from "react";
import { toast } from "react-toastify";
import "./login.css";

const AuthForm = ({ setLoggedIn }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    setLoggedIn(true);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!signupUsername || !signupPassword) {
      toast.error("Please enter both username and password");
      return;
    }
    toast.success("Signup successful! You can now log in.");
    setIsSignup(false);
    // Clear signup form
    setSignupUsername("");
    setSignupPassword("");
  };

  return (
    <div className="auth-form">
      {isSignup ? (
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsSignup(false)}>Log In</button>
          </p>
        </div>
      ) : (
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Log In</button>
          </form>
          <p>
            Don't have an account?{" "}
            <button onClick={() => setIsSignup(true)}>Sign Up</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
