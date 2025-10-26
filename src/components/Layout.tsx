"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import BottomNavigation from "./BottomNavigation";
import OfflineBanner from "./OfflineBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOnline } = useAppStore();
  const { currentUser } = useAuthStore();
  const pathname = usePathname();

  // Hide bottom navigation on onboarding and landing pages
  const hideNavigation =
    pathname === "/onboarding" || (!currentUser && pathname === "/");
  const showBottomNav = currentUser && !hideNavigation;

  return (
    <div className="min-h-screen bg-background">
      {!isOnline && <OfflineBanner />}

      <main className={showBottomNav ? "pb-20" : ""}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
