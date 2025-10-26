import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, Notification } from "@/types";

interface AppState {
  language: Language;
  isOnline: boolean;
  notifications: Notification[];
  setLanguage: (language: Language) => void;
  setIsOnline: (isOnline: boolean) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: "mg",
      isOnline: true,
      notifications: [],

      setLanguage: (language) => set({ language }),
      setIsOnline: (isOnline) => set({ isOnline }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "app-storage",
    }
  )
);
