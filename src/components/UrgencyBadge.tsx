"use client";

import { useTranslation } from "react-i18next";

interface UrgencyBadgeProps {
  urgency: "low" | "medium" | "high";
  className?: string;
}

export default function UrgencyBadge({
  urgency,
  className = "",
}: UrgencyBadgeProps) {
  const { t } = useTranslation();

  const getColorClass = () => {
    switch (urgency) {
      case "high":
        return "bg-error text-white";
      case "medium":
        return "bg-warning text-white";
      case "low":
        return "bg-success text-white";
      default:
        return "bg-text-secondary text-white";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClass()} ${className}`}
    >
      {t(urgency)}
    </span>
  );
}
