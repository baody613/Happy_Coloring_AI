import axios from "axios";
import { auth } from "./firebase";
import { safeLocalStorage, safeSessionStorage } from "./safeStorage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      try {
        // Try to get fresh token from Firebase Auth
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(true); // Force refresh

          // Save to appropriate storage based on rememberMe
          const rememberMe = safeLocalStorage.getItem("rememberMe") === "true";
          if (rememberMe) {
            safeLocalStorage.setItem("authToken", token);
          } else {
            safeSessionStorage.setItem("authToken", token);
          }

          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Fallback to stored token (check both storages)
          const token =
            safeLocalStorage.getItem("authToken") ||
            safeSessionStorage.getItem("authToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.error("Error getting auth token:", error);
        // Fallback to stored token
        const token =
          safeLocalStorage.getItem("authToken") ||
          safeSessionStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors (e.g., token expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken(true);

          // Save to appropriate storage
          const rememberMe = safeLocalStorage.getItem("rememberMe") === "true";
          if (rememberMe) {
            safeLocalStorage.setItem("authToken", token);
          } else {
            safeSessionStorage.setItem("authToken", token);
          }

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed, user needs to login again
        safeLocalStorage.removeItem("authToken");
        safeSessionStorage.removeItem("authToken");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
