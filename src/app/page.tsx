"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import { mockPosts, mockCommunityPosts } from "@/data/mockData";
import PostCard from "@/components/PostCard";
import CommunityBoard from "@/components/CommunityBoard";
import Header from "@/components/Header";
import EmptyState from "@/components/EmptyState";
import { Search } from "lucide-react";

interface FilterState {
  category: string;
  type: string;
  urgency: string;
  status: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    type: "all",
    urgency: "all",
    status: "all",
  });
  const { t } = useTranslation();
  const { currentUser } = useAuthStore();

  // If no user, show landing page with login/signup options
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-green/10 to-primary-gold/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-primary-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {t("welcome")}
          </h1>
          <p className="text-text-secondary mb-8">{t("welcomeSubtitle")}</p>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-primary-green text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-green/90 transition-colors"
            >
              {t("login")}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/onboarding")}
              className="w-full border border-primary-green text-primary-green px-6 py-3 rounded-lg font-medium hover:bg-primary-green/10 transition-colors"
            >
              {t("getStarted")}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "all" || post.category === filters.category;

    const matchesType = filters.type === "all" || post.type === filters.type;

    const matchesUrgency =
      filters.urgency === "all" || post.urgency === filters.urgency;

    const matchesStatus =
      filters.status === "all" || post.status === filters.status;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesUrgency &&
      matchesStatus
    );
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilters}
        currentFilters={filters}
      />

      {/* Community Board */}
      <section className="px-4 py-4">
        <CommunityBoard posts={mockCommunityPosts} />
      </section>

      {/* Posts Feed */}
      <section className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("recentPosts")}
          </h2>
          <span className="text-sm text-text-secondary">
            {filteredPosts.length} {t("posts")}
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={Search}
            title={t("noPostsFound")}
            description={t("noPostsFoundDescription")}
            actionLabel={t("createFirstPost")}
            onAction={() => (window.location.href = "/post")}
          />
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
