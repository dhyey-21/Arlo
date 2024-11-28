import React, { useState, useRef } from "react";
import Lottie from "react-lottie";
import animationData from "./VoiceWave.json";
import "./App.css";
import "./components/login.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // To toggle between login and signup
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  const chatContentRef = useRef(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoggedIn(true);
  };

  // Handle signup
  const handleSignup = (e) => {
    e.preventDefault();

    if (!signupUsername || !signupPassword) {
      toast.error("Please enter both username and password to sign up.");
      return;
    }

    toast.success("Signup successful! You can now log in.");

    setIsSignup(false);
  };

  // Chat functionalities
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const userMessage = { text: chatInput, sender: "You", type: "user" };
      addMessage(userMessage);
      setChatInput("");
      sendMessageToBackend(userMessage);
    }
  };

  const sendMessageToBackend = async (message) => {
    try {
      const reply = "This is Arlo's response to your message.";
      handleArloReply(reply);
    } catch (error) {
      console.error("Error sending message:", error);
      handleArloReply("There was an error connecting to the assistant.");
    }
  };

  const handleArloReply = (replyText) => {
    const arloMessage = { text: replyText, sender: "Arlo", type: "assistant" };
    addMessage(arloMessage);
    const utterance = new SpeechSynthesisUtterance(replyText);
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    window.speechSynthesis.speak(utterance);
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (speaking) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="app-container">
      <ToastContainer />
      {!loggedIn ? (
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
      ) : (
        <>
          <header className="header">
            <div className="logo">
              <span className="logo-text">Arlo</span>
            </div>
            <button
              className="connect-button"
              onClick={() => setSpeaking(!speaking)}
            >
              {speaking ? "Disconnect" : "Connect"}
            </button>
          </header>

          <div className="main-content">
            <div className="chat-section">
              <div className="chat-content" ref={chatContentRef}>
                {messages.map((message, index) => (
                  <div key={index} className={`chat-message ${message.type}`}>
                    <strong>{message.sender}:</strong> {message.text}
                  </div>
                ))}
              </div>
            </div>

            {speaking && (
              <div className="audio-section">
                <Lottie options={defaultOptions} height={80} width={80} />
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <textarea
              className="chat-input"
              placeholder="Type a message"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              rows={1}
              disabled={!speaking}
              onKeyPress={handleKeyPress}
            />
            {chatInput.trim() && (
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!speaking}
              >
                &#9658;
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

