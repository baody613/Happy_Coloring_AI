import { create } from "zustand";
import { User } from "@/types";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import api from "@/lib/api";
import { safeLocalStorage, safeSessionStorage } from "@/lib/safeStorage";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email, password, rememberMe = false) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      if (typeof window !== "undefined") {
        // Lưu rememberMe preference
        if (rememberMe) {
          safeLocalStorage.setItem("rememberMe", "true");
          safeLocalStorage.setItem("authToken", token);
        } else {
          safeLocalStorage.setItem("rememberMe", "false");
          safeSessionStorage.setItem("authToken", token);
        }
      }

      // Update display name if exists
      let displayName = userCredential.user.displayName;
      if (!displayName) {
        const { updateProfile } = await import("firebase/auth");
        displayName = email.split("@")[0];
        await updateProfile(userCredential.user, { displayName });
      }

      // Create user object from Firebase user
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        displayName: displayName || "User",
      };

      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signUp: async (email, password, displayName) => {
    try {
      set({ loading: true, error: null });

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      if (userCredential.user) {
        const { updateProfile } = await import("firebase/auth");
        await updateProfile(userCredential.user, { displayName });
      }

      const token = await userCredential.user.getIdToken();

      if (typeof window !== "undefined") {
        safeLocalStorage.setItem("authToken", token);
      }

      // Create user object
      const user: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        displayName: displayName,
      };

      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      if (typeof window !== "undefined") {
        safeLocalStorage.removeItem("authToken");
        safeLocalStorage.removeItem("rememberMe");
        safeSessionStorage.removeItem("authToken");
      }
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  setUser: (user) => set({ user }),

  initializeAuth: () => {
    // Check if running in browser
    if (typeof window === "undefined") {
      set({ loading: false });
      return;
    }

    // Check if user wants to be remembered
    const rememberMe = safeLocalStorage.getItem("rememberMe") === "true";

    // Listen to Firebase auth state changes
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get fresh token
          const token = await firebaseUser.getIdToken();

          // Only persist if rememberMe was enabled
          if (rememberMe) {
            safeLocalStorage.setItem("authToken", token);
          } else {
            safeSessionStorage.setItem("authToken", token);
          }

          // Create user object
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "User",
          };

          set({ user, loading: false });
        } catch (error) {
          console.error("Error getting user token:", error);
          safeLocalStorage.removeItem("authToken");
          safeSessionStorage.removeItem("authToken");
          set({ user: null, loading: false });
        }
      } else {
        // User is signed out - only clear if not remembered
        if (!rememberMe) {
          safeLocalStorage.removeItem("authToken");
          safeSessionStorage.removeItem("authToken");
        }
        set({ user: null, loading: false });
      }
    });
  },
}));
