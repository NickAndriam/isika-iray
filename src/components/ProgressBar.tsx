"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  current,
  total,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">
            Step {current} / {total}
          </span>
          <span className="text-sm text-text-secondary">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full bg-border rounded-full h-2">
        <motion.div
          className="bg-primary-green h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
