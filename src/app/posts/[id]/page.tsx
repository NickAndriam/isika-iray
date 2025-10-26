"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { getPostTypeTranslationKey, getPostTypeColors } from "@/lib/postUtils";
import { formatRelativeTime } from "@/lib/dateUtils";
import { mockPosts } from "@/data/mockData";
import { MapPin, Clock, Star, Shield, Share2, Heart, Flag } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import UserAvatar from "@/components/UserAvatar";
import ContactActions from "@/components/ContactActions";
import UrgencyBadge from "@/components/UrgencyBadge";
import ImageGallery from "@/components/ImageGallery";
import LoadingSpinner from "@/components/LoadingSpinner";

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

  if (!post) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <PageHeader
        title={t("postDetails")}
        actions={
          <>
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
          </>
        }
      />

      <div className="pb-20">
        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white"
        >
          {/* Images */}
          {post.images && post.images.length > 0 && (
            <ImageGallery images={post.images} alt={post.title} />
          )}

          {/* Post Info */}
          <div className="p-4 space-y-4">
            {/* Status and Urgency */}
            <div className="flex items-center justify-between">
              <UrgencyBadge urgency={post.urgency} />
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Clock size={14} />
                <span>{formatRelativeTime(post.createdAt, t)}</span>
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
              <UserAvatar user={post.user} size={48} />

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

            <ContactActions
              phoneNumber={post.user.phoneNumber}
              contactMethod={post.contactMethod}
              userId={post.userId}
              buttonSize="md"
              className="flex gap-3"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
