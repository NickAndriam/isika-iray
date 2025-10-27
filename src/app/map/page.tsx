"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/data/mockData";
import { MapPin, Filter, Users, Building } from "lucide-react";
import UserMap from "@/components/UserMap";
import { User as UserType } from "@/types";

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showPersonal, setShowPersonal] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();

  // Filter users based on map pins (users with coordinates)
  const usersWithLocation = mockUsers.filter(
    (user) => user.coordinates?.lat && user.coordinates?.lng
  );

  const filteredUsers = usersWithLocation.filter((user) => {
    const matchesType =
      (showPersonal && user.accountType === "personal") ||
      (showBusiness && user.accountType === "company");
    return matchesType;
  });

  const handleUserClick = (user: UserType) => {
    router.push(`/users/${user.id}`);
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
                  filteredUsers.filter(
                    (user) => user.accountType === "personal"
                  ).length
                }{" "}
                {t("personal")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Building size={14} className="text-primary-gold" />
              <span className="text-text-secondary">
                {
                  filteredUsers.filter((user) => user.accountType === "company")
                    .length
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
      <div
        className="h-[calc(100vh-200px)]"
        // className="h-[80vh]"
      >
        <UserMap users={filteredUsers} onUserClick={handleUserClick} />
      </div>

      {/* No Users */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 px-4"
        >
          <MapPin size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            {t("noUsersOnMap")}
          </h3>
          <p className="text-text-secondary mb-4">
            {t("noUsersOnMapDescription")}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
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
