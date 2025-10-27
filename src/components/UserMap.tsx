"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Building,
  User,
  Navigation,
  X,
  Star,
  LocateIcon,
} from "lucide-react";
import { User as UserType } from "@/types";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

let divIcon: any;
if (typeof window !== "undefined") {
  const leaflet = require("leaflet");
  divIcon = leaflet.divIcon;
}

// Custom icon for user markers
const createCustomIcon = (color: string) => {
  if (typeof window === "undefined" || !divIcon) return undefined;
  return divIcon({
    className: "custom-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
        <div style="width:36px;height:36px;background:${color};border-radius:50%;border:3px solid #fff;box-shadow:0 4px 10px rgba(59,130,246,0.25)"></div>
        <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid ${color};transform:translateY(-6px)"></div>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const UserMarker = () => {
  if (typeof window === "undefined" || !divIcon) return undefined;
  return divIcon({
    className: "custom-marker animate-pulse diration-500",
    html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
        <div style="width:36px;height:36px;background:#3b82f6;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 10px rgba(59,130,246,0.25)"></div>
        <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid #3b82f6;transform:translateY(-6px)"></div>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

interface UserMapProps {
  users: UserType[];
  onUserClick?: (user: UserType) => void;
  currentUserLocation?: [number, number] | null;
  height?: string;
  className?: string;
}

// Madagascar center coordinates (Antananarivo)
const DEFAULT_CENTER: [number, number] = [-18.8792, 47.5079];
const DEFAULT_ZOOM = 6;

export default function UserMap({
  users,
  onUserClick,
  currentUserLocation,
  height = "h-full",
  className = "",
}: UserMapProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [bounds, setBounds] = useState<
    [[number, number], [number, number]] | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate map bounds based on user locations
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const usersWithLocations = users.filter(
      (u) => u.coordinates?.lat && u.coordinates?.lng
    );

    if (usersWithLocations.length > 0) {
      const lats = usersWithLocations.map((u) => u.coordinates!.lat);
      const lngs = usersWithLocations.map((u) => u.coordinates!.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      setBounds([
        [minLat - 0.1, minLng - 0.1],
        [maxLat + 0.1, maxLng + 0.1],
      ]);
    }
  }, [users]);

  if (!mounted) {
    return (
      <div
        className={`${height} bg-surface border border-border rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-text-secondary">Loading map...</p>
      </div>
    );
  }

  const center = DEFAULT_CENTER;
  const zoom = bounds ? undefined : DEFAULT_ZOOM;

  const handleMarkerClick = (user: UserType) => {
    setSelectedUser(user);
    setShowDirections(false);
  };

  const handleCloseCard = () => {
    setSelectedUser(null);
    setShowDirections(false);
  };

  const handleSeeMore = (user: UserType) => {
    if (onUserClick) {
      onUserClick(user);
    }
    setSelectedUser(null);
    setShowDirections(false);
  };

  const handleShowDirections = () => {
    setShowDirections(true);
  };

  const handleOpenNavigation = (user: UserType) => {
    if (user.coordinates && currentUserLocation) {
      const url = `https://www.google.com/maps/dir/${currentUserLocation[0]},${currentUserLocation[1]}/${user.coordinates.lat},${user.coordinates.lng}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div
      className={`${height} rounded-lg overflow-hidden relative ${className}`}
    >
      <MapContainer
        center={center}
        zoom={bounds ? 10 : zoom}
        bounds={bounds || undefined}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ZoomControl position="topright" />

        {/* Current User Location Marker */}
        {currentUserLocation && (
          <Marker
            position={currentUserLocation}
            icon={UserMarker()} // Blue color for current user
          />
        )}

        {/* User Markers */}
        {users.map((user) => {
          if (!user.coordinates?.lat || !user.coordinates?.lng) return null;

          const markerColor =
            user.accountType === "company" ? "#10b981" : "#f59e0b";

          return (
            <Marker
              key={user.id}
              position={[user.coordinates.lat, user.coordinates.lng]}
              icon={createCustomIcon(markerColor)}
              eventHandlers={{
                click: () => handleMarkerClick(user),
              }}
            />
          );
        })}

        {/* Direction Line */}
        {showDirections &&
          selectedUser &&
          currentUserLocation &&
          selectedUser.coordinates && (
            <Polyline
              positions={[
                [currentUserLocation[0], currentUserLocation[1]],
                [selectedUser.coordinates.lat, selectedUser.coordinates.lng],
              ]}
              pathOptions={{ color: "#3b82f6", weight: 3, opacity: 0.7 }}
            />
          )}
      </MapContainer>

      {/* Floating User Card */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg border border-border p-4 z-999 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedUser.accountType === "company"
                    ? "bg-primary-green/20"
                    : "bg-primary-gold/20"
                }`}
              >
                {selectedUser.accountType === "company" ? (
                  <Building size={24} className="text-primary-green" />
                ) : (
                  <User size={24} className="text-primary-gold" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">
                      {selectedUser.accountType === "company"
                        ? selectedUser.businessName
                        : selectedUser.name}
                    </h3>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <MapPin size={12} />
                      <span className="truncate">
                        {selectedUser.region}
                        {selectedUser.commune && `, ${selectedUser.commune}`}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleCloseCard}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-surface transition-colors"
                  >
                    <X size={16} className="text-text-secondary" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-primary-gold" />
                    {selectedUser.rating.toFixed(1)}
                  </span>
                  <span>{selectedUser.reviewCount} reviews</span>
                </div>

                <div className="flex gap-2">
                  {currentUserLocation && (
                    <button
                      onClick={handleShowDirections}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        showDirections
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-primary-green text-white hover:bg-primary-green/90"
                      }`}
                    >
                      <Navigation size={14} />
                      {showDirections ? t("directions") : t("showDirections")}
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenNavigation(selectedUser)}
                    className="flex items-center justify-center gap-2 py-2 px-3 border border-primary-green text-primary-green rounded-lg text-sm font-medium hover:bg-primary-green/10 transition-colors"
                  >
                    <Navigation size={14} />
                    {t("navigate")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
