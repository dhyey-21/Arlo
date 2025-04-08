import { toast } from "react-toastify";

// Error codes from backend
const ERROR_CODES = {
  CONNECTION_ERROR: 1001,
  API_ERROR: 1002,
  AUTH_ERROR: 1003,
  FUNCTION_ERROR: 1004,
  CONFIG_ERROR: 1005,
  STATE_ERROR: 1006,
  EVENT_BUS_ERROR: 1007,
  UNKNOWN_ERROR: 9999,
};

// Error messages mapping
const ERROR_MESSAGES = {
  [ERROR_CODES.CONNECTION_ERROR]: "Connection error. Please try again.",
  [ERROR_CODES.API_ERROR]: "API error. Please try again.",
  [ERROR_CODES.AUTH_ERROR]: "Authentication error. Please log in again.",
  [ERROR_CODES.FUNCTION_ERROR]: "Function execution error. Please try again.",
  [ERROR_CODES.CONFIG_ERROR]: "Configuration error. Please contact support.",
  [ERROR_CODES.STATE_ERROR]: "State management error. Please refresh the page.",
  [ERROR_CODES.EVENT_BUS_ERROR]:
    "System communication error. Please try again.",
  [ERROR_CODES.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
};

export const handleError = (error) => {
  console.error("Error:", error);

  // Get error code from response
  const errorCode = error.response?.data?.error?.code;
  const errorMessage = error.response?.data?.error?.message;

  // Show appropriate error message
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    toast.error(ERROR_MESSAGES[errorCode]);
  } else if (errorMessage) {
    toast.error(errorMessage);
  } else {
    toast.error("An unexpected error occurred");
  }

  // Return error for further handling if needed
  return error;
};

export const isNetworkError = (error) => {
  return !error.response && error.message === "Network Error";
};

export const isTimeoutError = (error) => {
  return error.code === "ECONNABORTED";
};

export const getErrorMessage = (error) => {
  if (isNetworkError(error)) {
    return "Network connection error. Please check your internet connection.";
  }
  if (isTimeoutError(error)) {
    return "Request timed out. Please try again.";
  }
  return error.response?.data?.error?.message || "An unexpected error occurred";
};
