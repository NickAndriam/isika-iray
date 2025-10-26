"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number | null;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}: TabNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white border-b border-border ${className}`}
    >
      <div className="flex">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "text-primary-green border-b-2 border-primary-green"
                : "text-text-secondary hover:text-primary-green"
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
            {tab.count !== null && tab.count !== undefined && (
              <span className="bg-surface text-text-secondary text-xs px-2 py-1 rounded-full">
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
