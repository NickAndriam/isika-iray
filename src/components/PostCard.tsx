"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Star,
  Shield,
  Building,
  User,
} from "lucide-react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-success";
      case "solved":
        return "text-text-secondary";
      case "closed":
        return "text-error";
      default:
        return "text-text-secondary";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-error text-white";
      case "medium":
        return "bg-warning text-white";
      case "low":
        return "bg-success text-white";
      default:
        return "bg-text-secondary text-white";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return t("justNow");
    if (diffInHours < 24) return `${diffInHours}h ${t("ago")}`;
    return `${Math.floor(diffInHours / 24)}d ${t("ago")}`;
  };

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
            <div className="w-10 h-10 bg-primary-green/20 rounded-full flex items-center justify-center">
              {post.user.accountType === "company" ? (
                <Building size={20} className="text-primary-green" />
              ) : (
                <User size={20} className="text-primary-green" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary">
                  {post.user.accountType === "company"
                    ? post.user.businessName
                    : post.user.name}
                </h3>
                {post.user.isVerified && (
                  <Shield size={16} className="text-primary-green" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin size={12} />
                <span>{post.location.region}</span>
                {post.location.commune && (
                  <span>• {post.location.commune}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                post.urgency
              )}`}
            >
              {t(post.urgency)}
            </span>
            <span
              className={`text-sm font-medium ${getStatusColor(post.status)}`}
            >
              {t(post.status)}
            </span>
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
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-primary-green/10 text-primary-green text-xs font-medium rounded">
            {post.category}
          </span>
          <span className="text-sm text-text-secondary">
            {t(post.type === "help_request" ? "helpRequest" : "helpOffer")}
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
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          {post.contactMethod === "phone" || post.contactMethod === "both" ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(`tel:${post.user.phoneNumber}`)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-primary-green text-white rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
            >
              <Phone size={16} />
              {t("call")}
            </motion.button>
          ) : null}

          {post.contactMethod === "message" || post.contactMethod === "both" ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/messages?user=${post.userId}`)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-primary-green text-primary-green rounded-lg text-sm font-medium hover:bg-primary-green/10 transition-colors"
            >
              <MessageCircle size={16} />
              {t("message")}
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
