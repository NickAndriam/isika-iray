"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { getPostTypeTranslationKey, getPostTypeColors } from "@/lib/postUtils";
import { mockPosts } from "@/data/mockData";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Star,
  Shield,
  Building,
  User,
  Share2,
  Heart,
  Flag,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface PostDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostDetailsPage({ params }: PostDetailsPageProps) {
  const { id } = React.use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const post = useMemo(
    () => mockPosts.find((p) => String(p.id) === String(id)) || null,
    [id]
  );

  useEffect(() => {
    if (!post) {
      // Post not found, replace history and go to home
      router.replace("/");
    }
  }, [post, router]);

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

  const handleCall = () => {
    if (post?.user.phoneNumber) {
      window.open(`tel:${post.user.phoneNumber}`);
    }
  };

  const handleMessage = () => {
    // Navigate to messages or open chat
    router.push(`/messages?user=${post?.userId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const nextImage = () => {
    if (post?.images && currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-text-secondary">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-border sticky top-0 z-40"
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </motion.button>
              <h1 className="text-lg font-semibold text-text-primary">
                {t("postDetails")}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <Heart
                  size={20}
                  className={
                    isLiked ? "text-error fill-current" : "text-text-secondary"
                  }
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <Share2 size={20} className="text-text-secondary" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <Flag size={20} className="text-text-secondary" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="pb-20">
        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white"
        >
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="relative">
              <div className="aspect-video bg-border">
                <img
                  src={post.images[currentImageIndex]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onClick={() => setShowImageModal(true)}
                />
              </div>

              {/* Image Navigation */}
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === post.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {post.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Post Info */}
          <div className="p-4 space-y-4">
            {/* Status and Urgency */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                    post.urgency
                  )}`}
                >
                  {t(post.urgency)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Clock size={14} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Category and Type */}
            <div className="flex items-center gap-2">
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

            {/* Title */}
            <h1 className="text-xl font-bold text-text-primary">
              {post.title}
            </h1>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-surface text-text-secondary text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-2 text-text-secondary">
              <MapPin size={16} />
              <span>{post.location.region}</span>
              {post.location.commune && <span>• {post.location.commune}</span>}
            </div>
          </div>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white mt-2"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              {t("postedBy")}
            </h2>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-green/20 rounded-full flex items-center justify-center">
                {post.user.accountType === "company" ? (
                  <Building size={24} className="text-primary-green" />
                ) : (
                  <User size={24} className="text-primary-green" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/users/${post.user.id}`)}
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

                <div className="flex items-center gap-4 text-sm text-text-secondary mb-2">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-primary-gold" />
                    <span>{post.user.rating.toFixed(1)}</span>
                    <span>({post.user.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{post.user.region}</span>
                    {post.user.commune && <span>• {post.user.commune}</span>}
                  </div>
                </div>

                {/* Skills */}
                {post.user.skills && post.user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.user.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-surface text-text-secondary text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {post.user.skills.length > 3 && (
                      <span className="px-2 py-1 bg-surface text-text-secondary text-xs rounded">
                        +{post.user.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white mt-2"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              {t("contactUser")}
            </h2>

            <div className="flex gap-3">
              {post.contactMethod === "phone" ||
              post.contactMethod === "both" ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-green text-white rounded-lg font-medium hover:bg-primary-green/90 transition-colors"
                >
                  <Phone size={18} />
                  {t("call")}
                </motion.button>
              ) : null}

              {post.contactMethod === "message" ||
              post.contactMethod === "both" ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMessage}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-primary-green text-primary-green rounded-lg font-medium hover:bg-primary-green/10 transition-colors"
                >
                  <MessageCircle size={18} />
                  {t("message")}
                </motion.button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {showImageModal && post.images && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={post.images[currentImageIndex]}
              alt={post.title}
              className="max-w-full max-h-full object-contain"
            />

            {post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full disabled:opacity-50"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === post.images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full disabled:opacity-50"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
