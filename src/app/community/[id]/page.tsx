"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CommunityPost } from "@/types";
import { mockCommunityPosts } from "@/data/mockData";
import {
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Award,
  Star,
  Heart,
  Share2,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

interface CommunityPostDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CommunityPostDetailPage({ params }: CommunityPostDetailPageProps) {
  const { id } = React.use(params);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const post = useMemo(
    () => mockCommunityPosts.find((p) => String(p.id) === String(id)) || null,
    [id]
  );

  useEffect(() => {
    if (!post) {
      router.replace("/");
    }
  }, [post, router]);

  const getPostIcon = (type: string) => {
    switch (type) {
      case "tip":
        return Lightbulb;
      case "story":
        return BookOpen;
      case "expert_content":
        return Award;
      default:
        return Star;
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case "tip":
        return "text-primary-gold";
      case "story":
        return "text-primary-red";
      case "expert_content":
        return "text-primary-green";
      default:
        return "text-text-secondary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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

  const PostIcon = getPostIcon(post.type);
  const postColor = getPostColor(post.type);

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
                {t("communityPost")}
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
                  className={isLiked ? "text-error fill-current" : "text-text-secondary"}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <Share2 size={20} className="text-text-secondary" />
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
          {/* Image */}
          {post.image && (
            <div className="relative">
              <div className="aspect-video bg-border">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onClick={() => setShowImageModal(true)}
                />
              </div>
            </div>
          )}

          {/* Post Info */}
          <div className="p-4 space-y-4">
            {/* Type and Featured Badge */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center ${postColor}`}>
                <PostIcon size={16} />
              </div>
              <span className={`text-sm font-medium ${postColor}`}>
                {t(post.type)}
              </span>
              {post.featured && (
                <span className="px-2 py-1 bg-primary-gold/20 text-primary-gold text-xs font-medium rounded">
                  {t("featured")}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-text-primary">
              {post.title}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{t("by")} {post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white mt-2"
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              {t("relatedPosts")}
            </h2>

            <div className="space-y-3">
              {mockCommunityPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((relatedPost, index) => {
                  const RelatedIcon = getPostIcon(relatedPost.type);
                  const relatedColor = getPostColor(relatedPost.type);

                  return (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => router.push(`/community/${relatedPost.id}`)}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center ${relatedColor}`}>
                        <RelatedIcon size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${relatedColor}`}>
                            {t(relatedPost.type)}
                          </span>
                          {relatedPost.featured && (
                            <span className="px-2 py-0.5 bg-primary-gold/20 text-primary-gold text-xs font-medium rounded">
                              {t("featured")}
                            </span>
                          )}
                        </div>

                        <h3 className="font-medium text-text-primary text-sm mb-1 line-clamp-2">
                          {relatedPost.title}
                        </h3>

                        <p className="text-text-secondary text-xs line-clamp-2">
                          {relatedPost.content}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-text-muted">
                            {t("by")} {relatedPost.author}
                          </span>
                          <span className="text-xs text-text-muted">
                            {formatDate(relatedPost.createdAt)}
                          </span>
                        </div>
                      </div>

                      {relatedPost.image && (
                        <div className="w-12 h-12 bg-border rounded-lg overflow-hidden shrink-0">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      {showImageModal && post.image && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={post.image}
              alt={post.title}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
