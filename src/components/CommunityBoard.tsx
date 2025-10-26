"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CommunityPost } from "@/types";
import { Lightbulb, BookOpen, Award, ChevronRight, Star } from "lucide-react";

interface CommunityBoardProps {
  posts: CommunityPost[];
}

export default function CommunityBoard({ posts }: CommunityBoardProps) {
  const { t } = useTranslation();
  const router = useRouter();

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
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("communityBoard")}
        </h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/community")}
          className="text-primary-green text-sm font-medium flex items-center gap-1"
        >
          {t("viewAll")}
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <div className="space-y-3">
        {posts.slice(0, 3).map((post, index) => {
          const Icon = getPostIcon(post.type);
          const color = getPostColor(post.type);

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/community/${post.id}`)}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center ${color}`}
              >
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium ${color}`}>
                    {t(post.type)}
                  </span>
                  {post.featured && (
                    <span className="px-2 py-0.5 bg-primary-gold/20 text-primary-gold text-xs font-medium rounded">
                      {t("featured")}
                    </span>
                  )}
                </div>

                <h3 className="font-medium text-text-primary text-sm mb-1 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-text-secondary text-xs line-clamp-2">
                  {post.content}
                </p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-muted">
                    {t("by")} {post.author}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
              </div>

              {post.image && (
                <div className="w-12 h-12 bg-border rounded-lg overflow-hidden shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push("/community")}
        className="w-full mt-4 py-2 text-primary-green text-sm font-medium border border-primary-green rounded-lg hover:bg-primary-green/10 transition-colors"
      >
        {t("viewMoreContent")}
      </motion.button>
    </div>
  );
}
