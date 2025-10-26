"use client";

import { User } from "@/types";

const SESSION_KEY = "isika-iray-session";
const SESSION_EXPIRY_KEY = "isika-iray-session-expiry";

// Session expiry in milliseconds (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export interface SessionData {
  user: User;
  expiresAt: number;
}

/**
 * Save user session to localStorage
 */
export function saveSession(user: User): void {
  const expiresAt = Date.now() + SESSION_DURATION;
  const sessionData: SessionData = {
    user,
    expiresAt,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.toString());
}

/**
 * Get current session from localStorage
 */
export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    const expiryStr = localStorage.getItem(SESSION_EXPIRY_KEY);

    if (!sessionData || !expiryStr) return null;

    const session = JSON.parse(sessionData) as SessionData;
    const expiresAt = parseInt(expiryStr, 10);

    // Check if session is expired
    if (Date.now() > expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error reading session:", error);
    clearSession();
    return null;
  }
}

/**
 * Clear session from localStorage
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
}

/**
 * Check if user has a valid session
 */
export function hasValidSession(): boolean {
  return getSession() !== null;
}

/**
 * Get current user from session
 */
export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}
