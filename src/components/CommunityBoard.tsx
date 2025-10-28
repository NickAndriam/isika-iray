"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { CommunityPost } from "@/types";
import {
  Lightbulb,
  BookOpen,
  Award,
  ChevronRight,
  Star,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

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
        return "from-yellow-400 to-orange-500";
      case "story":
        return "from-red-400 to-pink-500";
      case "expert_content":
        return "from-green-400 to-emerald-500";
      default:
        return "from-blue-400 to-indigo-500";
    }
  };

  const getPostBorderColor = (type: string) => {
    switch (type) {
      case "tip":
        return "border-yellow-400";
      case "story":
        return "border-red-400";
      case "expert_content":
        return "border-green-400";
      default:
        return "border-blue-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Create story cards with 3x3 grid layout
  const createStoryCards = () => {
    const storyCards: any[] = [];

    // Add "Create Story" card first
    // storyCards.push(
    //   <motion.div
    //     key="create-story"
    //     initial={{ opacity: 0, scale: 0.8 }}
    //     animate={{ opacity: 1, scale: 1 }}
    //     transition={{ delay: 0.1 }}
    //     className="flex-shrink-0"
    //   >
    //     <Card className="w-24 h-32 cursor-pointer hover:scale-105 transition-transform duration-200 border-2 border-dashed border-gray-300 hover:border-primary-green">
    //       <CardContent className="p-0 h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    //         <div className="w-12 h-12 rounded-full bg-primary-green flex items-center justify-center mb-2">
    //           <Plus className="w-6 h-6 text-white" />
    //         </div>
    //         <span className="text-xs font-medium text-text-primary text-center px-1">
    //           {t("createStory")}
    //         </span>
    //       </CardContent>
    //     </Card>
    //   </motion.div>
    // );

    // Add community posts as story cards
    posts.slice(0, 8).forEach((post, index) => {
      const Icon = getPostIcon(post.type);
      const gradientColor = getPostColor(post.type);
      const borderColor = getPostBorderColor(post.type);

      storyCards.push(
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + (index + 1) * 0.05 }}
          className="flex-shrink-0"
        >
          <Card
            className={`w-24 h-32 cursor-pointer hover:scale-105 transition-transform duration-200 border-2 ${borderColor} overflow-hidden`}
            onClick={() => router.push(`/community/${post.id}`)}
          >
            <CardContent className="p-0 h-full relative">
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradientColor}`}
              />

              {/* Content overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-2">
                {/* Top section with icon and featured badge */}
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon size={14} className="text-white" />
                  </div>
                  {post.featured && (
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  )}
                </div>

                {/* Bottom section with title */}
                <div className="text-center">
                  <h3 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  <div className="mt-1">
                    <span className="text-xs text-white/80">
                      {t(post.type)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Author name at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm p-1">
                <span className="text-xs text-white font-medium truncate block">
                  {post.author}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    });

    return storyCards;
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("communityBoard")}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/community")}
          className="text-primary-green hover:text-primary-green/80 p-0 h-auto"
        >
          {t("viewAll")}
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">{createStoryCards()}</div>
      </ScrollArea>

      <Button
        variant="outline"
        className="w-full mt-4 border-primary-green text-primary-green hover:bg-primary-green/10"
        onClick={() => router.push("/community")}
      >
        {t("viewMoreContent")}
      </Button>
    </div>
  );
}
