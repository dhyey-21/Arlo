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
      // Get history from localStorage
      const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!historyData) {
        return [];
      }

      const history = JSON.parse(historyData);

      if (!Array.isArray(history)) {
        console.error("Invalid history data format in localStorage");
        return [];
      }

      // Sort history by date (newest first)
      return sortHistory(history);
    } catch (error) {
      console.error("Error in getAllHistory:", error);
      return [];
    }
  },

  // Add a new conversation
  addConversation: async (messages) => {
    try {
      const newConversation = createConversationEntry(messages);
      const today = getToday();

      // Get existing history
      const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
      let history = [];

      if (historyData) {
        history = JSON.parse(historyData);
        if (!Array.isArray(history)) {
          history = [];
        }
      }

      // Find today's entry or create a new one
      let todayEntry = history.find((entry) => entry.date === today);

      if (!todayEntry) {
        todayEntry = createDayEntry(newConversation);
        history.push(todayEntry);
      } else {
        todayEntry.conversations.push(newConversation);
      }

      // Save updated history
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return true;
    } catch (error) {
      console.error("Error adding conversation:", error);
      return false;
    }
  },

  // Clear all history
  clearHistory: async () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
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
