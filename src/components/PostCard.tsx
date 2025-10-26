"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { getPostTypeTranslationKey, getPostTypeColors } from "@/lib/postUtils";
import { formatRelativeTime } from "@/lib/dateUtils";
import { Post } from "@/types";
import { MapPin, Clock, Star, Shield } from "lucide-react";
import UserAvatar from "./UserAvatar";
import ContactActions from "./ContactActions";
import UrgencyBadge from "./UrgencyBadge";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/posts/${post.id}`);
  };

  return (
    <motion.article
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <UserAvatar user={post.user} size={40} />
            <div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/users/${post.user.id}`);
                  }}
                  className="font-semibold text-text-primary hover:text-primary-green transition-colors text-left"
                >
                  {post.user.accountType === "company"
                    ? post.user.businessName
                    : post.user.name}
                </motion.button>
                {post.user.isVerified && (
                  <Shield size={16} className="text-primary-green" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={12} />
                <span>{post.location.region}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <UrgencyBadge urgency={post.urgency} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-primary-gold" />
            <span>{post.user.rating.toFixed(1)}</span>
            <span>({post.user.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatRelativeTime(post.createdAt, t)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-primary-green/10 text-primary-green text-xs font-medium rounded">
            {t(getCategoryTranslationKey(post.category))}
          </span>
          <span
            className={`${getPostTypeColors(
              post.type
            )} px-2 py-1 text-xs rounded font-medium`}
          >
            {t(getPostTypeTranslationKey(post.type))}
          </span>
        </div>

        <h4 className="font-semibold text-text-primary mb-2">{post.title}</h4>

        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {post.images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className="w-20 h-20 bg-border rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`${post.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {post.images.length > 3 && (
              <div className="w-20 h-20 bg-border rounded-lg flex items-center justify-center">
                <span className="text-xs text-text-secondary">
                  +{post.images.length - 3}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface text-text-secondary text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Contact Actions */}
        <div onClick={(e) => e.stopPropagation()}>
          <ContactActions
            phoneNumber={post.user.phoneNumber}
            contactMethod={post.contactMethod}
            userId={post.userId}
          />
        </div>
      </div>
    </motion.article>
  );
}
