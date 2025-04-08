import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "../styles/History.css";
import historyService from "../services/historyService";

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const historyEndRef = useRef(null);
  const historyContentRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [autoExpandLatest, setAutoExpandLatest] = useState(true);

  // Load history when component mounts
  useEffect(() => {
    loadHistory();
  }, []);

  // Scroll to bottom when history updates and shouldScroll is true
  useEffect(() => {
    if (shouldScroll && historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [history, shouldScroll]);

  // Auto-expand latest date when history loads
  useEffect(() => {
    if (history.length > 0 && autoExpandLatest) {
      setSelectedDate(history[0].date);
      setAutoExpandLatest(false);
    }
  }, [history, autoExpandLatest]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await historyService.getAllHistory();
      if (!Array.isArray(data)) {
        throw new Error("Invalid history data format");
      }
      setHistory(data);
      setShouldScroll(true);
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
      toast.error("Failed to load conversation history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await historyService.clearHistory();
      setHistory([]);
      setSelectedDate(null);
      toast.success("History cleared successfully");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
  };

  const handleExportHistory = async () => {
    try {
      await historyService.exportHistory();
    } catch (error) {
      console.error("Error exporting history:", error);
      toast.error("Failed to export history");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(selectedDate === date ? null : date);
    setShouldScroll(false);
  };

  if (isLoading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">
          <i className="mdi mdi-loading mdi-spin"></i>
          <p>Loading your conversation history...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-container">
        <h1>Conversation History</h1>
        <div className="empty-history">
          <i className="mdi mdi-history"></i>
          <p>No conversations yet</p>
          <p className="empty-history-subtitle">
            Start chatting with Arlo to see your history here
          </p>
        </div>
        <div className="history-actions">
          <button className="export-history" onClick={handleExportHistory}>
            <i className="mdi mdi-download"></i>
            Export History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Conversation History</h1>
        <div className="history-actions">
          <button className="clear-history" onClick={handleClearHistory}>
            <i className="mdi mdi-delete"></i>
            Clear History
          </button>
          <button className="export-history" onClick={handleExportHistory}>
            <i className="mdi mdi-download"></i>
            Export History
          </button>
        </div>
      </div>

      <div className="history-content" ref={historyContentRef}>
        {history.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`history-day ${
              selectedDate === day.date ? "expanded" : ""
            }`}
          >
            <div
              className="date-header"
              onClick={() => handleDateClick(day.date)}
            >
              <h2>{formatDate(day.date)}</h2>
              <i
                className={`mdi ${
                  selectedDate === day.date
                    ? "mdi-chevron-up"
                    : "mdi-chevron-down"
                }`}
              ></i>
            </div>

            <div className="conversations-container">
              {day.conversations.map((conversation, convIndex) => (
                <div key={convIndex} className="conversation-group">
                  <div className="time-stamp">
                    <i className="mdi mdi-clock-outline"></i>
                    {conversation.time}
                  </div>

                  <div className="messages">
                    {conversation.messages.map((message, msgIndex) => (
                      <div
                        key={msgIndex}
                        className={`message ${
                          message.type === "user"
                            ? "user-message"
                            : "assistant-message"
                        }`}
                      >
                        <div className="message-header">
                          <i
                            className={`mdi ${
                              message.type === "user"
                                ? "mdi-account"
                                : "mdi-robot"
                            }`}
                          ></i>
                          <span className="message-sender">
                            {message.sender}
                          </span>
                        </div>
                        <div className="message-text">{message.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={historyEndRef} />
      </div>
    </div>
  );
};

export default History;
