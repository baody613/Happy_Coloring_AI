import axios from "axios";
import { auth } from "./firebase";
import { safeLocalStorage, safeSessionStorage } from "./safeStorage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

/** Persist auth token to the storage tier dictated by the rememberMe preference */
const storeToken = (token: string) => {
  const persistent = safeLocalStorage.getItem("rememberMe") === "true";
  if (persistent) {
    safeLocalStorage.setItem("authToken", token);
  } else {
    safeSessionStorage.setItem("authToken", token);
  }
};

/** Attempt to get a fresh Firebase ID token; returns null if not signed in */
const fetchFreshToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    const token = await user.getIdToken(true);
    storeToken(token);
    return token;
  } catch {
    return null;
  }
};

/** Read whatever token was last saved to either storage layer */
const readStoredToken = () =>
  safeLocalStorage.getItem("authToken") ||
  safeSessionStorage.getItem("authToken");

const clearStoredTokens = () => {
  safeLocalStorage.removeItem("authToken");
  safeSessionStorage.removeItem("authToken");
};

// ---- Request interceptor: attach auth header ----
api.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;
    const freshToken = await fetchFreshToken();
    const token = freshToken ?? readStoredToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ---- Response interceptor: handle 401 with one silent retry ----
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const req = err.config as typeof err.config & { __hasRetried?: boolean };
    if (err.response?.status === 401 && !req.__hasRetried) {
      req.__hasRetried = true;
      const newToken = await fetchFreshToken();
      if (newToken) {
        req.headers.Authorization = `Bearer ${newToken}`;
        return api(req);
      }
      clearStoredTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
