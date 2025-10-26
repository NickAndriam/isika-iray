"use client";

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { User, Post, Review } from "@/types";
import { mockUsers, mockPosts, mockReviews } from "@/data/mockData";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Star,
  Shield,
  Building,
  User as UserIcon,
  MessageCircle,
  Heart,
  Award,
  Calendar,
  Eye,
  ThumbsUp,
} from "lucide-react";

interface UserProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserProfilePage({ params }: UserProfilePageProps) {
  const { id } = React.use(params);
  const [activeTab, setActiveTab] = useState<"posts" | "reviews" | "about">(
    "posts"
  );
  const [isFollowing, setIsFollowing] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const user = useMemo(
    () => mockUsers.find((u) => String(u.id) === String(id)) || null,
    [id]
  );

  const userPosts = useMemo(
    () => (user ? mockPosts.filter((post) => post.userId === user.id) : []),
    [user]
  );

  const userReviews = useMemo(
    () =>
      user ? mockReviews.filter((review) => review.revieweeId === user.id) : [],
    [user]
  );

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  const handleMessage = () => {
    router.push(`/messages?user=${user?.id}`);
  };

  const handleCall = () => {
    if (user?.phoneNumber) {
      window.open(`tel:${user.phoneNumber}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getAccountTypeIcon = (accountType: string) => {
    return accountType === "company" ? Building : UserIcon;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-text-secondary">{t("loading")}</p>
        </div>
      </div>
    );
  }

  const AccountIcon = getAccountTypeIcon(user.accountType);

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
                {t("userProfile")}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  isFollowing
                    ? "bg-primary-green text-white"
                    : "bg-surface text-text-primary border border-border"
                }`}
              >
                {isFollowing ? t("following") : t("follow")}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="pb-20">
        {/* Profile Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-border"
        >
          <div className="p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-20 h-20 bg-primary-green/20 rounded-full flex items-center justify-center">
                <AccountIcon size={32} className="text-primary-green" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-text-primary">
                    {user.accountType === "company"
                      ? user.businessName
                      : user.name}
                  </h2>
                  {user.isVerified && (
                    <Shield size={20} className="text-primary-green" />
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-primary-gold" />
                  <span className="font-medium text-text-primary">
                    {user.rating.toFixed(1)}
                  </span>
                  <span className="text-text-secondary">
                    ({user.reviewCount} {t("reviews")})
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-text-secondary mb-2">
                  <MapPin size={14} />
                  <span>{user.region}</span>
                  {user.commune && <span>• {user.commune}</span>}
                </div>

                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Calendar size={14} />
                  <span>
                    {t("memberSince")} {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges */}
            {user.badges.length > 0 && (
              <div className="flex gap-2 mb-4">
                {user.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="flex items-center gap-1 px-2 py-1 bg-primary-green/10 text-primary-green text-xs font-medium rounded-full"
                  >
                    <Award size={12} />
                    {t(badge.name)}
                  </span>
                ))}
              </div>
            )}

            {/* Contact Actions */}
            <div className="flex gap-3">
              {user.phoneVisible && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCall}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-green text-white rounded-lg font-medium hover:bg-primary-green/90 transition-colors"
                >
                  <Phone size={18} />
                  {t("call")}
                </motion.button>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleMessage}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-primary-green text-primary-green rounded-lg font-medium hover:bg-primary-green/10 transition-colors"
              >
                <MessageCircle size={18} />
                {t("message")}
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Skills/Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-b border-border p-4"
        >
          <h3 className="font-semibold text-text-primary mb-3">
            {user.accountType === "company" ? t("services") : t("skills")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(user.accountType === "company"
              ? user.services
              : user.skills
            )?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-green/10 text-primary-green text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-b border-border p-4"
        >
          <h3 className="font-semibold text-text-primary mb-3">
            {t("contactInformation")}
          </h3>
          <div className="space-y-3">
            {user.phoneVisible && (
              <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                <Phone size={18} className="text-primary-green" />
                <span className="text-text-primary">{user.phoneNumber}</span>
              </div>
            )}

            {user.email && (
              <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                <Mail size={18} className="text-primary-green" />
                <span className="text-text-primary">{user.email}</span>
              </div>
            )}

            {user.facebookLink && (
              <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                <Facebook size={18} className="text-primary-green" />
                <span className="text-text-primary">Facebook</span>
              </div>
            )}
          </div>
        </motion.section>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border-b border-border"
        >
          <div className="flex">
            {[
              {
                id: "posts",
                label: t("posts"),
                icon: MessageCircle,
                count: userPosts.length,
              },
              {
                id: "reviews",
                label: t("reviews"),
                icon: Star,
                count: userReviews.length,
              },
              {
                id: "about",
                label: t("about"),
                icon: UserIcon,
                count: null,
              },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-green border-b-2 border-primary-green"
                    : "text-text-secondary hover:text-primary-green"
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="bg-surface text-text-secondary text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "posts" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {userPosts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle
                    size={32}
                    className="text-text-secondary mx-auto mb-2"
                  />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {t("noPostsYet")}
                  </h3>
                  <p className="text-text-secondary">
                    {t("noPostsYetDescription")}
                  </p>
                </div>
              ) : (
                userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => router.push(`/posts/${post.id}`)}
                    className="bg-white border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-primary-green/10 text-primary-green text-xs font-medium rounded">
                        {t(getCategoryTranslationKey(post.category))}
                      </span>
                      <span
                        className={`
                        ${
                          post.type === "help_request"
                            ? "bg-primary-gold/30 text-primary-gold border border-primary-gold"
                            : "bg-blue-400/30 text-blue-500 border border-blue-500"
                        }
                        px-2 py-1 text-xs rounded font-medium`}
                      >
                        {t(
                          post.type === "help_request"
                            ? "helpRequest"
                            : "helpOffer"
                        )}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          post.status === "open"
                            ? "text-success"
                            : post.status === "solved"
                            ? "text-text-secondary"
                            : "text-error"
                        }`}
                      >
                        {t(post.status)}
                      </span>
                    </div>

                    <h4 className="font-semibold text-text-primary mb-1">
                      {post.title}
                    </h4>

                    <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>{formatDate(post.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        <Eye size={12} />
                        <span>{t("viewPost")}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {userReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star
                    size={32}
                    className="text-text-secondary mx-auto mb-2"
                  />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {t("noReviewsYet")}
                  </h3>
                  <p className="text-text-secondary">
                    {t("noReviewsYetDescription")}
                  </p>
                </div>
              ) : (
                userReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < review.rating
                                ? "text-primary-gold fill-current"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="text-sm text-text-primary mb-2">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <Heart size={12} />
                      <span>{t(review.type)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-text-primary mb-3">
                  {t("aboutUser")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserIcon size={18} className="text-primary-green" />
                    <div>
                      <span className="text-sm text-text-secondary">
                        {t("accountType")}
                      </span>
                      <p className="text-text-primary">{t(user.accountType)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-primary-green" />
                    <div>
                      <span className="text-sm text-text-secondary">
                        {t("location")}
                      </span>
                      <p className="text-text-primary">
                        {user.region}
                        {user.commune && `, ${user.commune}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-primary-green" />
                    <div>
                      <span className="text-sm text-text-secondary">
                        {t("memberSince")}
                      </span>
                      <p className="text-text-primary">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star size={18} className="text-primary-green" />
                    <div>
                      <span className="text-sm text-text-secondary">
                        {t("rating")}
                      </span>
                      <p className="text-text-primary">
                        {user.rating.toFixed(1)} ({user.reviewCount}{" "}
                        {t("reviews")})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-white border border-border rounded-lg p-4">
                <h3 className="font-semibold text-text-primary mb-3">
                  {t("trustIndicators")}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {t("verified")}
                    </span>
                    <div className="flex items-center gap-1">
                      {user.isVerified ? (
                        <>
                          <Shield size={16} className="text-primary-green" />
                          <span className="text-sm text-primary-green">
                            {t("yes")}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-text-secondary">
                          {t("no")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {t("phoneVisible")}
                    </span>
                    <div className="flex items-center gap-1">
                      {user.phoneVisible ? (
                        <>
                          <Phone size={16} className="text-primary-green" />
                          <span className="text-sm text-primary-green">
                            {t("yes")}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-text-secondary">
                          {t("no")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
