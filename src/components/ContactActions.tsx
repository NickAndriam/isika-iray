"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Phone, MessageCircle } from "lucide-react";

interface ContactActionsProps {
  phoneNumber?: string;
  contactMethod: "phone" | "message" | "both";
  userId?: string;
  buttonSize?: "sm" | "md";
  className?: string;
}

export default function ContactActions({
  phoneNumber,
  contactMethod,
  userId,
  buttonSize = "md",
  className = "",
}: ContactActionsProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleCall = () => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    }
  };

  const handleMessage = () => {
    if (userId) {
      router.push(`/messages?user=${userId}`);
    }
  };

  const buttonSizeClass =
    buttonSize === "sm" ? "text-xs py-2 px-3" : "py-2 px-4 text-sm";

  return (
    <div className={className || "flex gap-2"}>
      {(contactMethod === "phone" || contactMethod === "both") && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleCall}
          className={`flex-1 flex items-center justify-center gap-2 bg-primary-green text-white rounded-lg font-medium hover:bg-primary-green/90 transition-colors ${buttonSizeClass}`}
        >
          <Phone size={16} />
          {t("call")}
        </motion.button>
      )}

      {(contactMethod === "message" || contactMethod === "both") && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleMessage}
          className={`flex-1 flex items-center justify-center gap-2 border border-primary-green text-primary-green rounded-lg font-medium hover:bg-primary-green/10 transition-colors ${buttonSizeClass}`}
        >
          <MessageCircle size={16} />
          {t("message")}
        </motion.button>
      )}
    </div>
  );
}
