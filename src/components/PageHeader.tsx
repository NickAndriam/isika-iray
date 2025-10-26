"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  onBack,
  actions,
  className = "",
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`bg-white border-b border-border sticky top-0 z-40 ${className}`}
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {onBack !== null && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </motion.button>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-text-primary">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </motion.header>
  );
}
