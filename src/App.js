import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthForm from "./pages/AuthForm";
import MainPage from "./pages/MainPage";
import History from "./pages/History";
import Navbar from "./Components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { toast } from "react-toastify";
import { authService } from "./services/authService";

// Wrapper component to handle location changes
const AppContent = () => {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [morphing, setMorphing] = useState(false);
  const browserSupportsSpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const { resetTranscript, finalTranscript, interimTranscript } =
    useSpeechRecognition({
      commands: [],
      continuous: true,
      language: "en-US",
      interimResults: true,
      maxAlternatives: 1,
      clearTranscriptOnListen: false,
    });

  // Check if user is logged in on component mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    console.log("App mounted, checking user:", user);
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  // Clear transcript and reset states when navigating away from main page
  useEffect(() => {
    if (location.pathname !== "/") {
      resetTranscript();
      setTranscript("");
      setSpeaking(false);
      setMorphing(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (finalTranscript) {
      setTranscript(finalTranscript);
    }
  }, [finalTranscript]);

  useEffect(() => {
    if (interimTranscript) {
      setTranscript(interimTranscript);
    }
  }, [interimTranscript]);

  const handleLogout = () => {
    console.log("Handling logout");
    authService.logout();
    setLoggedIn(false);
    setIsConnected(false);
    setIsListening(false);
    setIsMuted(false);
    setTranscript("");
    setSpeaking(false);
    setMorphing(false);
    // Only clear current messages, keep history
    localStorage.removeItem("arlo_messages");
    SpeechRecognition.stopListening();
    toast.success("Successfully logged out");
  };

  const handleConnect = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error(
        "Speech recognition is not supported in your browser. Please use Chrome."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach((track) => track.stop());

      // Start continuous listening with optimized settings
      await SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        clearTranscriptOnListen: false,
      });
      setIsConnected(true);
      setIsListening(true);
      toast.success("Successfully connected! Agent is now listening.");
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
      setIsListening(false);
      if (error.name === "NotAllowedError") {
        toast.error(
          "Microphone access denied. Please allow microphone access."
        );
      } else {
        toast.error(
          "Failed to connect. Please check your microphone and try again."
        );
      }
    }
  };

  const handleDisconnect = () => {
    SpeechRecognition.stopListening();
    setIsConnected(false);
    setIsListening(false);
    setIsMuted(false);
    setTranscript("");
    setSpeaking(false);
    setMorphing(false);
    toast.info("Successfully disconnected");
  };

  const handleToggleMute = () => {
    if (isMuted) {
      // Clear any existing transcript before starting to listen again
      resetTranscript();
      setTranscript("");

      SpeechRecognition.startListening({
        continuous: true,
        language: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        clearTranscriptOnListen: true, // Clear transcript when starting to listen
      });
      setIsListening(true);
      setIsMuted(false);
      toast.info("Agent unmuted");
    } else {
      SpeechRecognition.stopListening();
      setIsListening(false);
      setIsMuted(true);
      setTranscript(""); // Clear the transcript when muting
      resetTranscript(); // Reset the speech recognition transcript
      toast.info("Agent muted");
    }
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
        <Navbar
          handleLogout={handleLogout}
          handleConnect={handleConnect}
          handleDisconnect={handleDisconnect}
          isConnected={isConnected}
        />
      )}
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
          path="/history"
          element={loggedIn ? <History /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/*"
          element={
            loggedIn ? (
              <MainPage
                setLoggedIn={setLoggedIn}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                isListening={isListening}
                setIsListening={setIsListening}
                isMuted={isMuted}
                handleToggleMute={handleToggleMute}
                transcript={transcript}
                setTranscript={setTranscript}
                resetTranscript={resetTranscript}
                browserSupportsSpeechRecognition={
                  browserSupportsSpeechRecognition
                }
                speaking={speaking}
                setSpeaking={setSpeaking}
                morphing={morphing}
                setMorphing={setMorphing}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
