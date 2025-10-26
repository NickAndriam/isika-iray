"use client";

import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  showReviewCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function RatingDisplay({
  rating,
  reviewCount,
  showReviewCount = true,
  size = "md",
  className = "",
}: RatingDisplayProps) {
  const { t } = useTranslation();

  const sizeMap = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const starSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star size={starSize} className="text-primary-gold" />
      <span
        className={`font-medium text-text-primary ${
          size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : ""
        }`}
      >
        {rating.toFixed(1)}
      </span>
      {showReviewCount && reviewCount !== undefined && (
        <span
          className={`text-text-secondary ${
            size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"
          }`}
        >
          ({reviewCount} {t("reviews")})
        </span>
      )}
    </div>
  );
}
