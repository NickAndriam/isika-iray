'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  className = ''
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Search size={18} className="text-text-secondary" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white text-text-primary placeholder-text-secondary"
      />
      
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-surface transition-colors"
        >
          <X size={16} className="text-text-secondary" />
        </motion.button>
      )}
    </div>
  );
}
