import React, { useState, useRef, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import AuthForm from "./components/AuthForm";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import ChatInput from "./components/ChatInput";
import animationData from "./VoiceWave.json";
import "./App.css";
import "./components/login.css";

// Constants for API endpoints (for later)
const API_ENDPOINTS = {
  CHAT: "/api/chat",
};

function App() {
  // Auth states
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Chat states
  const [speaking, setSpeaking] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContentRef = useRef(null);

  // Speech recognition
  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition();

  // Animation options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Auth handlers
  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    toast.success("Signup successful! You can now log in.");
    setIsSignup(false);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setMessages([]);
    setSpeaking(false);
  };

  // Chat handlers
  const handleSendMessage = async (transcript) => {
    if (!transcript?.trim()) return;

    try {
      // Add user message to chat
      const userMessage = { text: transcript, sender: "You", type: "user" };
      addMessage(userMessage);
      setChatInput("");

      // Send to backend and get response
      await sendMessageToBackend(userMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const sendMessageToBackend = async (message) => {
    try {
      // TODO: Replace with actual API call
      const reply = "This is Arlo's response to your message.";
      await handleArloReply(reply);
    } catch (error) {
      console.error("Error from backend:", error);
      throw error;
    }
  };

  const handleArloReply = async (replyText) => {
    const arloMessage = { text: replyText, sender: "Arlo", type: "assistant" };
    addMessage(arloMessage);

    // Text-to-speech
    const utterance = new SpeechSynthesisUtterance(replyText);
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    window.speechSynthesis.speak(utterance);
  };

  // Helper functions
  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  };

  // Speech recognition handlers
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(
        (transcript) => {
          console.log("Received transcript:", transcript);
          if (transcript?.trim()) {
            setChatInput(transcript);
            handleSendMessage(transcript);
          }
        },
        (error) => {
          console.error("Speech recognition error:", error);
          toast.error("Speech recognition failed. Please try again.");
          stopListening();
        }
      );
    }
  };

  // Input handlers
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && speaking) {
      e.preventDefault();
      handleSendMessage(chatInput);
    }
  };

  // Effects
  useEffect(() => {
    if (!isSupported) {
      toast.warning(
        "Speech recognition is not supported in your browser. Please use Chrome for best experience."
      );
    }
  }, [isSupported]);

  // Render methods (you can move these to separate components later)
  const renderAuthForm = () => {
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

  return (
    <div className="app-container">
      <ToastContainer />
      {!loggedIn ? (
        <AuthForm setLoggedIn={setLoggedIn} />
      ) : (
        <>
          <Header
            speaking={speaking}
            setSpeaking={setSpeaking}
            handleLogout={handleLogout}
          />
          <ChatInterface
            messages={messages}
            chatContentRef={chatContentRef}
            speaking={speaking}
            defaultOptions={defaultOptions}
          />
          <ChatInput
            chatInput={chatInput}
            setChatInput={setChatInput}
            speaking={speaking}
            handleKeyPress={handleKeyPress}
            isSupported={isSupported}
            isListening={isListening}
            toggleListening={toggleListening}
            handleSendMessage={handleSendMessage}
          />
        </>
      )}
    </div>
  );
}

export default App;
