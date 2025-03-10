import React from "react";
import "../styles/History.css";

const History = () => {
  // This would typically come from a database or localStorage
  const mockHistory = [
    {
      date: "2024-03-10",
      conversations: [
        {
          time: "14:30",
          messages: [
            { type: "user", text: "Hello Arlo!" },
            { type: "assistant", text: "Hi! How can I help you today?" },
          ],
        },
        {
          time: "14:35",
          messages: [
            { type: "user", text: "What's the weather like?" },
            {
              type: "assistant",
              text: "I can help you check the weather. Where are you located?",
            },
          ],
        },
      ],
    },
    {
      date: "2024-03-09",
      conversations: [
        {
          time: "09:15",
          messages: [
            { type: "user", text: "Good morning" },
            { type: "assistant", text: "Good morning! How may I assist you?" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="history-container">
      <h1>Conversation History</h1>

      <div className="history-content">
        {mockHistory.map((day, dayIndex) => (
          <div key={dayIndex} className="history-day">
            <h2 className="date-header">{day.date}</h2>

            {day.conversations.map((conversation, convIndex) => (
              <div key={convIndex} className="conversation-group">
                <div className="time-stamp">{conversation.time}</div>

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
                      <div className="message-sender">
                        {message.type === "user" ? "You" : "Arlo"}
                      </div>
                      <div className="message-text">{message.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="history-actions">
        <button className="clear-history">
          <i className="mdi mdi-delete"></i>
          Clear History
        </button>
        <button className="export-history">
          <i className="mdi mdi-download"></i>
          Export History
        </button>
      </div>
    </div>
  );
};

export default History;
