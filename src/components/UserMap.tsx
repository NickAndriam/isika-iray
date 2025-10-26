"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Building, User, Navigation } from "lucide-react";
import { User as UserType } from "@/types";

// Dynamically import Leaflet components to avoid SSR issues
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

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Import leaflet CSS only on client side
if (typeof window !== "undefined") {
  require("leaflet/dist/leaflet.css");
}

// Import leaflet modules only on client side
let Icon: any, divIcon: any;
if (typeof window !== "undefined") {
  const leaflet = require("leaflet");
  Icon = leaflet.Icon;
  divIcon = leaflet.divIcon;
}

// Custom icon for user markers
function createCustomIcon(color: string) {
  if (typeof window === "undefined" || !divIcon) return undefined;

  return divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
}

// Default icon for users without location
let DefaultIcon: any;
if (typeof window !== "undefined" && Icon) {
  DefaultIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
}

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
  height = "h-[100%]",
  className = "",
}: UserMapProps) {
  const [mounted, setMounted] = useState(false);
  const [bounds, setBounds] = useState<
    [[number, number], [number, number]] | null
  >(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate map bounds based on user locations
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

  return (
    <div className={`${height} rounded-lg overflow-hidden ${className} -z-10`}>
      <MapContainer
        center={center}
        zoom={zoom}
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
          const customIcon = createCustomIcon(markerColor);

          return (
            <Marker
              key={user.id}
              position={[user.coordinates.lat, user.coordinates.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2 mb-2">
                    {user.accountType === "company" ? (
                      <Building size={16} className="text-primary-green" />
                    ) : (
                      <User size={16} className="text-primary-gold" />
                    )}
                    <h3 className="font-semibold text-text-primary">
                      {user.accountType === "company"
                        ? user.businessName
                        : user.name}
                    </h3>
                  </div>
                  <p className="text-sm text-text-secondary mb-1">
                    {user.region}
                    {user.commune && `, ${user.commune}`}
                  </p>
                  <button
                    onClick={() => onUserClick?.(user)}
                    className="flex items-center gap-1 text-xs text-primary-green hover:text-primary-green/80 mt-2"
                  >
                    <Navigation size={12} />
                    View Profile
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
