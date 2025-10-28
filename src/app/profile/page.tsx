"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { formatDate } from "@/lib/dateUtils";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { mockPosts, mockReviews } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Settings,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Shield,
  Award,
  Heart,
  MessageCircle,
  Star,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import UserAvatar from "@/components/UserAvatar";
import TabNavigation from "@/components/TabNavigation";
import RatingDisplay from "@/components/RatingDisplay";
import LocationMap from "@/components/LocationMap";
import LoadingSpinner from "@/components/LoadingSpinner";
import SingleUserMap from "@/components/SingleUserMap";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"posts" | "reviews" | "settings">(
    "posts"
  );
  // include i18n to actually change the runtime language
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuthStore();
  const { setLanguage } = useAppStore();

  const userPosts = currentUser
    ? mockPosts.filter((post) => post.userId === currentUser.id)
    : [];
  const userReviews = currentUser
    ? mockReviews.filter((review) => review.revieweeId === currentUser.id)
    : [];

  const handleLogout = () => {
    logout();
  };

  // update both i18next runtime and your app store so the UI and persisted state change
  const handleLanguageChange = async (language: string) => {
    await i18n.changeLanguage(language);
    setLanguage(language as "mg" | "fr" | "en");
  };

  const handleMapVisibilityChange = (visible: boolean) => {
    if (currentUser) {
      // Update the user's map visibility setting
      const updatedUser = { ...currentUser, mapVisible: visible };
      // In a real app, you would save this to the backend
      // For now, we'll just update the local state
      console.log("Map visibility changed to:", visible);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner message={t("loginRequiredDescription")} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <PageHeader
        title={t("myProfile")}
        subtitle={t("manageYourAccount")}
        actions={
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-surface hover:bg-border transition-colors"
          >
            <Edit size={20} className="text-text-secondary" />
          </motion.button>
        }
      />

      {/* Profile Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-border p-4"
      >
        <div className="flex items-start gap-4 mb-4">
          <UserAvatar user={currentUser} size={80} />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-text-primary">
                {currentUser.accountType === "company"
                  ? currentUser.businessName
                  : currentUser.name}
              </h2>
              {currentUser.isVerified && (
                <Shield size={20} className="text-primary-green" />
              )}
            </div>

            <div className="mb-2">
              <RatingDisplay
                rating={currentUser.rating}
                reviewCount={currentUser.reviewCount}
                size="md"
              />
            </div>

            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <MapPin size={14} />
              <span>{currentUser.region}</span>
              {currentUser.commune && <span>• {currentUser.commune}</span>}
            </div>
          </div>
        </div>

        {/* Badges */}
        {currentUser.badges.length > 0 && (
          <div className="flex gap-2 mb-4">
            {currentUser.badges.map((badge) => (
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

        {/* Contact Info */}
        <div className="flex flex-wrap gap-2">
          {currentUser.phoneVisible && (
            <div className="flex items-center gap-2 p-2 bg-surface rounded-lg">
              <Phone size={16} className="text-primary-green" />
              <span className="text-sm text-text-primary">
                {currentUser.phoneNumber}
              </span>
            </div>
          )}

          {currentUser.email && (
            <div className="flex items-center gap-2 p-2 bg-surface rounded-lg">
              <Mail size={16} className="text-primary-green" />
              <span className="text-sm text-text-primary">
                {currentUser.email}
              </span>
            </div>
          )}

          {currentUser.facebookLink && (
            <div className="flex items-center gap-2 p-2 bg-surface rounded-lg">
              <Facebook size={16} className="text-primary-green" />
              <span className="text-sm text-text-primary">Facebook</span>
            </div>
          )}
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
          {currentUser.accountType === "company" ? t("services") : t("skills")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(currentUser.accountType === "company"
            ? currentUser.services
            : currentUser.skills
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

      {/* Location Map */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white border-b border-border p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary">{t("location")}</h3>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // TODO: Open location editor modal
              alert("Location editor coming soon!");
            }}
            className="text-sm text-primary-green hover:text-primary-green/80 font-medium flex items-center gap-1"
          >
            <Edit size={14} />
            {t("changeLocation")}
          </motion.button>
        </div>
        {currentUser.coordinates ? (
          <>
            <SingleUserMap user={currentUser} height="h-64" />
            <div className="mt-2 text-xs text-text-secondary">
              <p>
                {currentUser.region}
                {currentUser.commune && `, ${currentUser.commune}`}
              </p>
              <p>
                {currentUser.coordinates.lat.toFixed(4)},{" "}
                {currentUser.coordinates.lng.toFixed(4)}
              </p>
            </div>
          </>
        ) : (
          <div className="h-64 border border-border rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary mb-3">
                {t("noLocationSet")}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="bg-primary-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
              >
                {t("addLocation")}
              </motion.button>
            </div>
          </div>
        )}
      </motion.section>

      {/* Tabs */}
      <TabNavigation
        tabs={[
          {
            id: "posts",
            label: t("myPosts"),
            icon: MessageCircle,
            count: userPosts.length,
          },
          {
            id: "reviews",
            label: t("myRatings"),
            icon: Star,
            count: userReviews.length,
          },
          {
            id: "settings",
            label: t("settings"),
            icon: Settings,
            count: null,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) =>
          setActiveTab(tab as "posts" | "reviews" | "settings")
        }
      />

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
                <p className="text-text-secondary mb-4">
                  {t("noPostsYetDescription")}
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/post")}
                  className="bg-primary-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
                >
                  {t("createFirstPost")}
                </motion.button>
              </div>
            ) : (
              userPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-green/10 text-primary-green text-xs font-medium rounded">
                      {t(getCategoryTranslationKey(post.category))}
                    </span>
                    <span className="text-xs text-text-secondary">
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
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="text-primary-green hover:text-primary-green/80 transition-colors"
                    >
                      {t("edit")}
                    </motion.button>
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
                <Star size={32} className="text-text-secondary mx-auto mb-2" />
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

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Language Settings */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-3">
                {t("language")}
              </h3>
              <div className="space-y-2">
                {[
                  { code: "mg", name: "Malagasy", flag: "🇲🇬" },
                  { code: "fr", name: "Français", flag: "🇫🇷" },
                  { code: "en", name: "English", flag: "🇺🇸" },
                ].map((lang) => (
                  <motion.button
                    key={lang.code}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-text-primary">{lang.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Map Visibility Settings */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-3">
                {t("mapVisible")}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {t("mapVisibilityDescription")}
              </p>
              <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
                <input
                  type="checkbox"
                  id="mapVisibility"
                  checked={currentUser.mapVisible || false}
                  onChange={(e) => handleMapVisibilityChange(e.target.checked)}
                  className="w-5 h-5 text-primary-blue border-2 border-border rounded focus:ring-primary-blue focus:ring-2"
                />
                <label
                  htmlFor="mapVisibility"
                  className="text-sm text-text-primary cursor-pointer"
                >
                  {t("mapVisible")}
                </label>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="font-semibold text-text-primary mb-3">
                {t("account")}
              </h3>
              <div className="space-y-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors text-left"
                >
                  <Edit size={20} className="text-primary-green" />
                  <span className="text-text-primary">{t("editProfile")}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface transition-colors text-left"
                >
                  <LogOut size={20} className="text-error" />
                  <span className="text-error">{t("logout")}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
