"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import { mockMapPins, categories } from "@/data/mockData";
import { MapPin, Filter, Users, Building, Star } from "lucide-react";

export default function MapPage() {
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showPersonal, setShowPersonal] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { t } = useTranslation();

  const filteredPins = mockMapPins.filter((pin) => {
    const matchesCategory =
      selectedCategory === "all" ||
      pin.posts.some((post) => post.category === selectedCategory);

    const matchesType =
      (showPersonal && pin.user.accountType === "personal") ||
      (showBusiness && pin.user.accountType === "company");

    return matchesCategory && matchesType;
  });

  const selectedPinData = selectedPin
    ? mockMapPins.find((pin) => pin.id === selectedPin)
    : null;

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
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {t("map")}
              </h1>
              <p className="text-sm text-text-secondary">{t("nearbyHelp")}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-surface hover:bg-border transition-colors"
            >
              <Filter size={20} className="text-text-secondary" />
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-primary-green" />
              <span className="text-text-secondary">
                {
                  filteredPins.filter(
                    (pin) => pin.user.accountType === "personal"
                  ).length
                }{" "}
                {t("personal")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Building size={14} className="text-primary-gold" />
              <span className="text-text-secondary">
                {
                  filteredPins.filter(
                    (pin) => pin.user.accountType === "company"
                  ).length
                }{" "}
                {t("business")}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-b border-border px-4 py-4"
        >
          <div className="space-y-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-2">
                {t("filterByCategory")}
              </h3>
              <div className="flex gap-2 overflow-x-auto">
                {["all", ...categories].map((category) => (
                  <motion.button
                    key={category}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-primary-green text-white"
                        : "bg-surface text-text-secondary hover:bg-border"
                    }`}
                  >
                    {category === "all"
                      ? t("category_all")
                      : t(getCategoryTranslationKey(category))}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-2">
                {t("showTypes")}
              </h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showPersonal}
                    onChange={(e) => setShowPersonal(e.target.checked)}
                    className="w-4 h-4 text-primary-green border-border rounded focus:ring-primary-green"
                  />
                  <span className="text-sm text-text-primary">
                    {t("personal")}
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showBusiness}
                    onChange={(e) => setShowBusiness(e.target.checked)}
                    className="w-4 h-4 text-primary-green border-border rounded focus:ring-primary-green"
                  />
                  <span className="text-sm text-text-primary">
                    {t("business")}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Container */}
      <div className="relative h-96 bg-linear-to-br from-primary-green/20 to-primary-gold/20">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-linear-to-br from-primary-green/10 to-primary-gold/10 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="text-primary-green mx-auto mb-2" />
            <p className="text-text-secondary">{t("interactiveMap")}</p>
            <p className="text-sm text-text-muted">{t("mapDescription")}</p>
          </div>
        </div>

        {/* Map Pins */}
        {filteredPins.map((pin, index) => (
          <motion.button
            key={pin.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedPin(pin.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
              pin.user.accountType === "company"
                ? "text-primary-gold"
                : "text-primary-green"
            }`}
            style={{
              left: `${20 + ((index * 15) % 60)}%`,
              top: `${30 + ((index * 20) % 40)}%`,
            }}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                pin.user.accountType === "company"
                  ? "bg-primary-gold"
                  : "bg-primary-green"
              }`}
            >
              {pin.user.accountType === "company" ? (
                <Building size={16} className="text-white" />
              ) : (
                <Users size={16} className="text-white" />
              )}
            </div>
            {pin.isOnline && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border border-white" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected Pin Details */}
      {selectedPinData && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white border-t border-border p-4"
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedPinData.user.accountType === "company"
                  ? "bg-primary-gold/20"
                  : "bg-primary-green/20"
              }`}
            >
              {selectedPinData.user.accountType === "company" ? (
                <Building size={24} className="text-primary-gold" />
              ) : (
                <Users size={24} className="text-primary-green" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-text-primary">
                {selectedPinData.user.accountType === "company"
                  ? selectedPinData.user.businessName
                  : selectedPinData.user.name}
              </h3>
              <p className="text-sm text-text-secondary">
                {selectedPinData.user.region}
                {selectedPinData.user.commune &&
                  ` • ${selectedPinData.user.commune}`}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Star size={14} className="text-primary-gold" />
                <span className="text-sm text-text-secondary">
                  {selectedPinData.user.rating.toFixed(1)} (
                  {selectedPinData.user.reviewCount} {t("reviews")})
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-primary">
              {t("availablePosts")} ({selectedPinData.posts.length})
            </h4>
            {selectedPinData.posts.slice(0, 2).map((post) => (
              <div key={post.id} className="p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-1 bg-primary-green/10 text-primary-green text-xs font-medium rounded">
                    {t(getCategoryTranslationKey(post.category))}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {t(
                      post.type === "help_request" ? "helpRequest" : "helpOffer"
                    )}
                  </span>
                </div>
                <h5 className="font-medium text-text-primary text-sm">
                  {post.title}
                </h5>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {post.description}
                </p>
              </div>
            ))}
            {selectedPinData.posts.length > 2 && (
              <p className="text-sm text-primary-green font-medium">
                +{selectedPinData.posts.length - 2} {t("morePosts")}
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 px-4 bg-primary-green text-white rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
            >
              {t("viewProfile")}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 px-4 border border-primary-green text-primary-green rounded-lg text-sm font-medium hover:bg-primary-green/10 transition-colors"
            >
              {t("contact")}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {filteredPins.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <MapPin size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {t("noResultsFound")}
          </h3>
          <p className="text-text-secondary mb-4">
            {t("noResultsDescription")}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory("all");
              setShowPersonal(true);
              setShowBusiness(true);
            }}
            className="bg-primary-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
          >
            {t("clearFilters")}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
