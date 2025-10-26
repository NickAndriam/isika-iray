"use client";

import { useTranslation } from "react-i18next";

interface StatusBadgeProps {
  status: "open" | "solved" | "closed";
  className?: string;
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  const { t } = useTranslation();

  const getColorClass = () => {
    switch (status) {
      case "open":
        return "text-success";
      case "solved":
        return "text-text-secondary";
      case "closed":
        return "text-error";
      default:
        return "text-text-primary";
    }
  };

  return (
    <span className={`text-xs font-medium ${getColorClass()} ${className}`}>
      {t(status)}
    </span>
  );
}
