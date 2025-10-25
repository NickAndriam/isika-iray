'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import BottomNavigation from './BottomNavigation';
import OfflineBanner from './OfflineBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOnline } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      {!isOnline && <OfflineBanner />}
      
      <main className="pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
