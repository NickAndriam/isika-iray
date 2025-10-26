"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import {
  saveSession,
  clearSession,
  getSession,
  getCurrentUser,
} from "@/lib/session";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  initializeSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: !!user });
        if (user) {
          saveSession(user);
        }
      },

      login: (user) => {
        set({ currentUser: user, isAuthenticated: true });
        saveSession(user);
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
        clearSession();
        window.location.href = "/";
      },

      initializeSession: () => {
        const session = getSession();
        if (session) {
          set({ currentUser: session.user, isAuthenticated: true });
        } else {
          set({ currentUser: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
