// Constants for storage keys
const STORAGE_KEYS = {
  HISTORY: "arlo_chat_history",
};

// Helper function to format date
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Helper function to format time
const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// Helper function to get today's date
const getToday = () => {
  return formatDate(new Date());
};

// Helper function to get current time
const getCurrentTime = () => {
  return formatTime(new Date());
};

// Helper function to create a new conversation entry
const createConversationEntry = (messages) => {
  return {
    time: getCurrentTime(),
    messages: messages.map((msg) => ({
      type: msg.type,
      text: msg.text,
      sender: msg.sender,
    })),
  };
};

// Helper function to create a new day entry
const createDayEntry = (conversation) => {
  return {
    date: getToday(),
    conversations: [conversation],
  };
};

// Helper function to sort history by date
const sortHistory = (history) => {
  return history.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// History service
const historyService = {
  // Get all history
  getAllHistory: async () => {
    try {
      // Get from backend
      const response = await fetch("/api/history");
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      const data = await response.json();
      return sortHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  },

  // Add a new conversation
  addConversation: async (messages) => {
    try {
      const newConversation = createConversationEntry(messages);

      // Send to backend
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConversation),
      });

      if (!response.ok) {
        throw new Error("Failed to add conversation");
      }

      return true;
    } catch (error) {
      console.error("Error adding conversation:", error);
      return false;
    }
  },

  // Clear all history
  clearHistory: async () => {
    try {
      // Clear from backend
      const response = await fetch("/api/history", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear history");
      }

      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  },

  // Export history
  exportHistory: async () => {
    try {
      const history = await historyService.getAllHistory();
      const blob = new Blob([JSON.stringify(history, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `arlo_history_${getToday()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error("Error exporting history:", error);
      return false;
    }
  },
};

export default historyService;
