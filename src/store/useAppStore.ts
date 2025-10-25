import { create } from 'zustand';
import { User, Language, Notification } from '@/types';

interface AppState {
  currentUser: User | null;
  language: Language;
  isOnline: boolean;
  notifications: Notification[];
  setCurrentUser: (user: User | null) => void;
  setLanguage: (language: Language) => void;
  setIsOnline: (isOnline: boolean) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  language: 'mg',
  isOnline: true,
  notifications: [],
  
  setCurrentUser: (user) => set({ currentUser: user }),
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
}));
