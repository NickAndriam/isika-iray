"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { initializeSession } = useAuthStore();

  useEffect(() => {
    // Initialize session on mount
    initializeSession();
  }, [initializeSession]);

  return <>{children}</>;
}
