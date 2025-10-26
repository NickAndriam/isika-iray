"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

interface FilterState {
  category: string;
  type: string;
  urgency: string;
  status: string;
}

interface HeaderComponentProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onFilterChange,
  currentFilters,
}: HeaderComponentProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(currentFilters);
  const { t } = useTranslation();

  const categories = [
    "all",
    "Farming",
    "Electronics",
    "Tutoring",
    "Health",
    "Mechanics",
    "Repairs",
    "Automotive",
    "Construction",
    "Cooking",
    "Language",
    "Other",
  ];

  const types = [
    { value: "all", label: t("all") },
    { value: "help_request", label: t("helpRequest") },
    { value: "help_offer", label: t("helpOffer") },
  ];

  const urgencyLevels = [
    { value: "all", label: t("all") },
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
  ];

  const statusOptions = [
    { value: "all", label: t("all") },
    { value: "open", label: t("open") },
    { value: "solved", label: t("solved") },
    { value: "closed", label: t("closed") },
  ];

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: "all",
      type: "all",
      urgency: "all",
      status: "all",
    };
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(currentFilters).filter((value) => value !== "all")
      .length;
  };

  return (
    <>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-border sticky top-0 z-40 shadow-sm"
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-linear-to-br from-primary-green to-primary-gold rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🤝</span>
              </div>
              <span className="text-lg font-bold text-text-primary hidden sm:block">
                Isika iray
              </span>
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-2">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder={t("searchPosts")}
              />
            </div>

            {/* Filter Button */}
            <Button
              variant={getActiveFiltersCount() > 0 ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilterModal(true)}
              className={cn(
                "relative",
                getActiveFiltersCount() > 0 && "bg-primary-green hover:bg-primary-green/90"
              )}
            >
              <Filter size={20} />
              {getActiveFiltersCount() > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">
                  {t("filterPosts")}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilterModal(false)}
                  className="p-1 rounded-lg hover:bg-surface transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </motion.button>
              </div>

              {/* Filter Content */}
              <div className="overflow-y-auto max-h-[60vh] p-4 space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                    <span>{t("category")}</span>
                    <ChevronDown size={16} className="text-text-secondary" />
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={tempFilters.category === category ? "default" : "outline"}
                        onClick={() =>
                          setTempFilters({ ...tempFilters, category })
                        }
                        className={cn(
                          "h-auto p-3 text-sm font-medium",
                          tempFilters.category === category && "bg-primary-green hover:bg-primary-green/90"
                        )}
                      >
                        {category === "all" ? t("all") : category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                    <span>{t("type")}</span>
                    <ChevronDown size={16} className="text-text-secondary" />
                  </h3>
                  <div className="space-y-2">
                    {types.map((type) => (
                      <motion.button
                        key={type.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setTempFilters({ ...tempFilters, type: type.value })
                        }
                        className={`w-full p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                          tempFilters.type === type.value
                            ? "bg-primary-green text-white"
                            : "bg-surface text-text-primary hover:bg-border"
                        }`}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Urgency Filter */}
                <div>
                  <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                    <span>{t("urgency")}</span>
                    <ChevronDown size={16} className="text-text-secondary" />
                  </h3>
                  <div className="space-y-2">
                    {urgencyLevels.map((urgency) => (
                      <motion.button
                        key={urgency.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setTempFilters({
                            ...tempFilters,
                            urgency: urgency.value,
                          })
                        }
                        className={`w-full p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                          tempFilters.urgency === urgency.value
                            ? "bg-primary-green text-white"
                            : "bg-surface text-text-primary hover:bg-border"
                        }`}
                      >
                        {urgency.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h3 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                    <span>{t("status")}</span>
                    <ChevronDown size={16} className="text-text-secondary" />
                  </h3>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <motion.button
                        key={status.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setTempFilters({
                            ...tempFilters,
                            status: status.value,
                          })
                        }
                        className={`w-full p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                          tempFilters.status === status.value
                            ? "bg-primary-green text-white"
                            : "bg-surface text-text-primary hover:bg-border"
                        }`}
                      >
                        {status.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1"
                >
                  {t("reset")}
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-primary-green hover:bg-primary-green/90"
                >
                  {t("apply")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
