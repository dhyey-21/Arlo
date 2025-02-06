import { useState, useEffect, useCallback } from "react";

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition is not supported in this browser");
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = "en-US";
    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startListening = useCallback(
    (onResult, onError) => {
      if (!recognition) {
        const error = new Error("Recognition not initialized");
        console.error(error);
        onError?.(error);
        return;
      }

      recognition.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        console.log("Speech recognition result received");
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        } else {
          onError?.(new Error("No speech was detected"));
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        onError?.(event);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended");
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        onError?.(error);
        setIsListening(false);
      }
    },
    [recognition]
  );

  const stopListening = useCallback(() => {
    if (!recognition) return;

    try {
      recognition.stop();
    } catch (error) {
      console.error("Error stopping recognition:", error);
    }
  }, [recognition]);

  return {
    isListening,
    startListening,
    stopListening,
    isSupported: "webkitSpeechRecognition" in window,
  };
};

export default useSpeechRecognition;
