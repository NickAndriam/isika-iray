"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { mockUsers, categories } from "@/data/mockData";
import { getCategoryTranslationKey } from "@/lib/categoryUtils";
import {
  MapPin,
  Filter,
  Users,
  Building,
  X,
  Search,
  Navigation,
  MapPinned,
} from "lucide-react";
import UserMap from "@/components/UserMap";
import { User as UserType } from "@/types";

export default function MapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showPersonal, setShowPersonal] = useState(true);
  const [showBusiness, setShowBusiness] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const { t } = useTranslation();
  const router = useRouter();
  const { currentUser } = useAuthStore();

  // Get user's current location with permission checks and friendly errors
  useEffect(() => {
    let cancelled = false;

    const requestLocation = async () => {
      setLocationError(null);

      if (!("geolocation" in navigator)) {
        setLocationError(
          t("geolocationNotSupported") || "Geolocation not supported"
        );
        return;
      }

      // If Permissions API is available, check current state first
      try {
        // TS: PermissionName includes "geolocation"
        // @ts-ignore
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({
            name: "geolocation",
          });
          if (status.state === "denied") {
            setLocationError(
              t("locationPermissionDenied") ||
                "Location permission denied. Enable location in browser or OS settings."
            );
            return;
          }
        }
      } catch {
        // ignore permission check errors
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return;
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLocationError(null);
        },
        (error) => {
          if (cancelled) return;
          console.error("Error getting location:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                t("locationPermissionDenied") ||
                  "Location permission denied. Please allow location access."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(
                t("locationPositionUnavailable") || "Position unavailable."
              );
              break;
            case error.TIMEOUT:
              setLocationError(
                t("locationTimeout") || "Location request timed out."
              );
              break;
            default:
              setLocationError(t("locationError") || "Error getting location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000,
        }
      );
    };

    requestLocation();

    return () => {
      cancelled = true;
    };
  }, [t]);

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
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Full Screen Map */}
      <div className="absolute inset-0 pb-20 z-0">
        <UserMap
          users={filteredUsers}
          onUserClick={handleUserClick}
          currentUserLocation={userLocation}
          className="h-full w-full"
        />
      </div>

      {/* Filters Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-20 w-full max-w-sm bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary">
                  {t("filters")}
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                />
                <input
                  type="text"
                  placeholder={t("searchUsers")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                />
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  {t("categories")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["all", ...categories.slice(0, 6)].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-primary-green text-white"
                          : "bg-surface text-text-secondary hover:bg-border"
                      }`}
                    >
                      {category === "all"
                        ? t("category_all")
                        : t(getCategoryTranslationKey(category))}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  {t("accountType")}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-border transition-colors">
                    <input
                      type="checkbox"
                      checked={showPersonal}
                      onChange={(e) => setShowPersonal(e.target.checked)}
                      className="w-5 h-5 text-primary-green border-border rounded focus:ring-primary-green"
                    />
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-primary-gold" />
                      <span className="text-sm text-text-primary">
                        {t("personal")}
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-surface rounded-lg cursor-pointer hover:bg-border transition-colors">
                    <input
                      type="checkbox"
                      checked={showBusiness}
                      onChange={(e) => setShowBusiness(e.target.checked)}
                      className="w-5 h-5 text-primary-green border-border rounded focus:ring-primary-green"
                    />
                    <div className="flex items-center gap-2">
                      <Building size={18} className="text-primary-green" />
                      <span className="text-sm text-text-primary">
                        {t("business")}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-surface rounded-lg p-4">
                <h3 className="text-sm font-medium text-text-primary mb-3">
                  {t("results")}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {t("personal")}
                    </span>
                    <span className="font-medium text-text-primary">
                      {
                        filteredUsers.filter(
                          (user) => user.accountType === "personal"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      {t("business")}
                    </span>
                    <span className="font-medium text-text-primary">
                      {
                        filteredUsers.filter(
                          (user) => user.accountType === "company"
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Toggle Button */}
      {!showFilters && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className="absolute top-4 left-4 z-40 p-3 bg-white rounded-lg shadow-lg border border-border hover:bg-surface transition-colors"
        >
          <Filter size={20} className="text-text-primary" />
        </motion.button>
      )}

      {/* Current Location Button */}
      {userLocation && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 left-20 z-40 p-3 bg-white rounded-lg shadow-lg border border-border hover:bg-surface transition-colors"
        >
          <MapPinned size={20} className="text-primary-green" />
        </motion.button>
      )}

      {/* show friendly location error with a retry button on mobile */}
      {locationError && (
        <div className="absolute top-4 right-4 z-50 max-w-xs">
          <div className="bg-white border border-border rounded-lg px-3 py-2 shadow-sm text-sm text-text-primary">
            <div className="mb-2">{locationError}</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLocationError(null);
                  // trigger the effect again by calling getCurrentPosition directly
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) =>
                        setUserLocation([
                          position.coords.latitude,
                          position.coords.longitude,
                        ]),
                      (err) => {
                        console.error("Retry location error:", err);
                        setLocationError(
                          t("locationError") || "Error getting location."
                        );
                      },
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  }
                }}
                className="px-3 py-2 bg-primary-green text-white rounded-md text-xs"
              >
                {t("retry") || "Retry"}
              </button>
              <button
                onClick={() => setLocationError(null)}
                className="px-3 py-2 border border-border rounded-md text-xs"
              >
                {t("dismiss") || "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
