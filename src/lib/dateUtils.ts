import { useTranslation } from "react-i18next";

/**
 * Format a date string to a relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(dateString: string, t: any): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return t("justNow");
  if (diffInHours < 24) return `${diffInHours}h ${t("ago")}`;
  return `${Math.floor(diffInHours / 24)}d ${t("ago")}`;
}

/**
 * Format a date string to a locale date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

/**
 * Format a timestamp to a short time format (e.g., "2h", "3d")
 */
export function formatShortTime(timestamp: string, t: any): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return t("justNow");
  if (diffInHours < 24) return `${diffInHours}h`;
  return date.toLocaleDateString();
}
