"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { mockCommunityPosts } from "@/data/mockData";
import {
  ArrowLeft,
  Lightbulb,
  BookOpen,
  Award,
  Star,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

export default function CommunitySeeAllPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const types = [
    { value: "all", label: t("all") },
    { value: "tip", label: t("tip") },
    { value: "story", label: t("story") },
    { value: "expert_content", label: t("expertContent") },
  ];

  const filteredPosts = mockCommunityPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || post.type === selectedType;

    return matchesSearch && matchesType;
  });

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

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-border sticky top-0 z-40"
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-surface transition-colors"
              >
                <ArrowLeft size={20} className="text-text-primary" />
              </motion.button>
              <h1 className="text-lg font-semibold text-text-primary">
                {t("communityBoard")}
              </h1>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-surface hover:bg-border transition-colors"
            >
              <Filter size={20} className="text-text-secondary" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-text-secondary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchCommunityPosts")}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-full focus:ring-2 focus:ring-primary-green focus:border-transparent bg-white text-text-primary placeholder-text-secondary"
            />
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-4 bg-white border-b border-border"
        >
          <div className="space-y-3">
            <h3 className="font-medium text-text-primary flex items-center gap-2">
              <span>{t("filterByType")}</span>
              <ChevronDown size={16} className="text-text-secondary" />
            </h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <motion.button
                  key={type.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type.value
                      ? "bg-primary-green text-white"
                      : "bg-surface text-text-primary hover:bg-border"
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts List */}
      <div className="px-4 py-4 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("allPosts")}
          </h2>
          <span className="text-sm text-text-secondary">
            {filteredPosts.length} {t("posts")}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-text-secondary" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              {t("noPostsFound")}
            </h3>
            <p className="text-text-secondary">
              {t("noPostsFoundDescription")}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => {
              const PostIcon = getPostIcon(post.type);
              const postColor = getPostColor(post.type);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => router.push(`/community/${post.id}`)}
                  className="bg-white rounded-xl border border-border p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full bg-surface flex items-center justify-center ${postColor}`}>
                      <PostIcon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium ${postColor}`}>
                          {t(post.type)}
                        </span>
                        {post.featured && (
                          <span className="px-2 py-0.5 bg-primary-gold/20 text-primary-gold text-xs font-medium rounded">
                            {t("featured")}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-text-secondary text-sm mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>{t("by")} {post.author}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>

                    {post.image && (
                      <div className="w-16 h-16 bg-border rounded-lg overflow-hidden shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
