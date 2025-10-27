"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { User } from "@/types";
import "leaflet/dist/leaflet.css";

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
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);
let divIcon: any;
if (typeof window !== "undefined") {
  const leaflet = require("leaflet");
  divIcon = leaflet.divIcon;
}

// Custom icon for user marker
const createCustomIcon = (color: string) => {
  if (typeof window === "undefined" || !divIcon) return undefined;
  return divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

interface SingleUserMapProps {
  user: User;
  height?: string;
  className?: string;
}

export default function SingleUserMap({
  user,
  height = "h-64",
  className = "",
}: SingleUserMapProps) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !user.coordinates?.lat || !user.coordinates?.lng) {
    return (
      <div
        className={`${height} bg-surface border border-border rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-text-secondary">Map unavailable</p>
      </div>
    );
  }

  const position: [number, number] = [
    user.coordinates.lat,
    user.coordinates.lng,
  ];
  const markerColor = user.accountType === "company" ? "#10b981" : "#f59e0b";

  return (
    <div className={`${height} rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />

        <Marker position={position} icon={createCustomIcon(markerColor)} />
      </MapContainer>
    </div>
  );
}
