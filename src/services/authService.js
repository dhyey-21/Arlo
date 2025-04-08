import { toast } from "react-toastify";

// Local storage keys
const STORAGE_KEYS = {
  USER: "arlo_user",
  MESSAGES: "arlo_messages",
};

// Simulated user database (in memory)
let users = [
  {
    email: "test@example.com",
    password: "password123", // In a real app, this would be hashed
  },
  {
    email: "dhyeydevloper@arlo.com",
    password: "123456",
  }
];

export const authService = {
  async login(email, password) {
    try {
      console.log("Attempting login with:", email);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        console.log("Login failed: Invalid credentials");
        throw new Error("Invalid email or password");
      }

      // Store user in localStorage
      const userData = {
        email: user.email,
        lastLogin: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      console.log("Login successful for:", email);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(email, password) {
    try {
      console.log("Attempting registration with:", email);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        console.log("Registration failed: Email already exists");
        throw new Error("Email already registered");
      }

      // Add new user to memory
      users.push({ email, password });
      console.log("New user registered:", email);

      // Store user in localStorage
      const userData = { email, lastLogin: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout() {
    console.log("Logging out user");
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Keep messages in localStorage for persistence
    // localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  },

  getCurrentUser() {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) return null;

      const user = JSON.parse(userData);

      // Validate user data
      if (!user || !user.email) {
        console.error("Invalid user data in localStorage");
        authService.logout();
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      authService.logout();
      return null;
    }
  },

  isAuthenticated() {
    const user = authService.getCurrentUser();
    return !!user;
  },
};
