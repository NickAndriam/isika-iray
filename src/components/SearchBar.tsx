"use client";

import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
        <Search size={18} className="text-muted-foreground" />
      </div>

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="pl-10 pr-10 h-12 rounded-full text-base touch-manipulation"
        style={{
          WebkitAppearance: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors z-10"
          type="button"
        >
          <X size={16} className="text-muted-foreground" />
        </motion.button>
      )}
    </div>
  );
}
