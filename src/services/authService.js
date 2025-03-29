import { toast } from "react-toastify";

// In a real application, this would be your API endpoint
const API_URL = "https://api.example.com/auth";

// Simulated user database (in a real app, this would be in your backend)
let users = [
  {
    email: "test@example.com",
    password: "password123", // In a real app, this would be hashed
  },
];

export const authService = {
  async login(email, password) {
    try {
      console.log("Attempting login with:", email);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        console.log("Login failed: Invalid credentials");
        throw new Error("Invalid email or password");
      }

      // In a real app, you would store a JWT token
      localStorage.setItem("user", JSON.stringify({ email: user.email }));
      console.log("Login successful for:", email);
      return { success: true, user: { email: user.email } };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async register(email, password) {
    try {
      console.log("Attempting registration with:", email);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        console.log("Registration failed: Email already exists");
        throw new Error("Email already registered");
      }

      // In a real app, you would hash the password
      users.push({ email, password });
      console.log("New user registered:", email);

      // In a real app, you would store a JWT token
      localStorage.setItem("user", JSON.stringify({ email }));
      return { success: true, user: { email } };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout() {
    console.log("Logging out user");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    console.log("Current user:", user);
    return user ? JSON.parse(user) : null;
  },
};
