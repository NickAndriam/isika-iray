"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Building, User, Navigation, X, Star } from "lucide-react";
import { User as UserType } from "@/types";
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
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

interface UserMapProps {
  users: UserType[];
  onUserClick?: (user: UserType) => void;
  height?: string;
  className?: string;
}

// Madagascar center coordinates (Antananarivo)
const DEFAULT_CENTER: [number, number] = [-18.8792, 47.5079];
const DEFAULT_ZOOM = 6;

export default function UserMap({
  users,
  onUserClick,
  height = "h-full",
  className = "",
}: UserMapProps) {
  const [mounted, setMounted] = useState(false);
  const [bounds, setBounds] = useState<
    [[number, number], [number, number]] | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

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
  };

  const handleCloseCard = () => {
    setSelectedUser(null);
  };

  const handleSeeMore = (user: UserType) => {
    if (onUserClick) {
      onUserClick(user);
    }
    setSelectedUser(null);
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

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
      </MapContainer>

      {/* Floating User Card */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-border p-4 z-50 max-w-sm"
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
                  <button
                    onClick={() => handleSeeMore(selectedUser)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary-green text-white rounded-lg text-sm font-medium hover:bg-primary-green/90 transition-colors"
                  >
                    <Navigation size={14} />
                    See More
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
