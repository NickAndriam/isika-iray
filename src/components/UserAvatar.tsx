"use client";

import { Building, User } from "lucide-react";
import { User as UserType } from "@/types";

interface UserAvatarProps {
  user: UserType | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  user,
  size = 32,
  className = "",
}: UserAvatarProps) {
  if (!user) return null;

  const Icon = user.accountType === "company" ? Building : User;

  return (
    <div
      className={`bg-primary-green/20 rounded-full flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Icon size={size * 0.6} className="text-primary-green" />
    </div>
  );
}
