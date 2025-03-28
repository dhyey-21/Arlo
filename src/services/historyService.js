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

// History service
const historyService = {
  // Get all history
  getAllHistory: async () => {
    try {
      // For testing: Get from localStorage
      const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return history ? JSON.parse(history) : [];

      // TODO: When backend is ready, replace with:
      // const response = await fetch('/api/history');
      // return await response.json();
    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  },

  // Add a new conversation
  addConversation: async (messages) => {
    try {
      const history = await historyService.getAllHistory();
      const today = getToday();
      const newConversation = createConversationEntry(messages);

      // Find today's entry
      const todayEntry = history.find((day) => day.date === today);

      if (todayEntry) {
        // Add to existing day
        todayEntry.conversations.push(newConversation);
      } else {
        // Create new day entry
        history.push(createDayEntry(newConversation));
      }

      // For testing: Save to localStorage
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

      // TODO: When backend is ready, replace with:
      // await fetch('/api/history', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newConversation)
      // });

      return true;
    } catch (error) {
      console.error("Error adding conversation:", error);
      return false;
    }
  },

  // Clear all history
  clearHistory: async () => {
    try {
      // For testing: Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.HISTORY);

      // TODO: When backend is ready, replace with:
      // await fetch('/api/history', { method: 'DELETE' });

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
