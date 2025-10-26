"use client";

import { useTranslation } from "react-i18next";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export default function LoadingSpinner({
  message,
  className = "",
}: LoadingSpinnerProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`min-h-screen bg-surface flex items-center justify-center ${className}`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
        <p className="text-text-secondary">{message || t("loading")}</p>
      </div>
    </div>
  );
}
