"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Plus, MapPin, MessageCircle, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import useScrollDirection from "@/hooks/useScrollDirection";

const navItems = [
  { href: "/", icon: Home, label: "home" },
  { href: "/map", icon: MapPin, label: "map" },
  { href: "/post", icon: Plus, label: "post" },
  { href: "/messages", icon: MessageCircle, label: "messages" },
  { href: "/profile", icon: User, label: "profile" },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const direction = useScrollDirection();
  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: direction === "down" ? 100 : 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 25 }}
      style={{ willChange: "transform" }}
      className="fixed bottom-0 left-0 right-0 bg-white border border-border z-50 rounded-t-4xl shadow-2xl"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link key={href} href={href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary-red"
                    : "text-text-secondary hover:text-primary-red"
                }`}
              >
                <div
                  className={`transition-transform duration-200 ${
                    isActive ? "scale-110" : ""
                  }`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-[9px] mt-1 font-medium">{t(label)}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
