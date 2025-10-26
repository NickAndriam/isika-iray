"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

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

const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents),
  { ssr: false }
);

// Import leaflet CSS only on client side
if (typeof window !== "undefined") {
  require("leaflet/dist/leaflet.css");
}

// Import Icon only on client side
let Icon: any;
if (typeof window !== "undefined") {
  const leaflet = require("leaflet");
  Icon = leaflet.Icon;
}

// Fix for default marker icon in React-Leaflet
const DefaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Madagascar center coordinates (Antananarivo)
const DEFAULT_CENTER: [number, number] = [-18.8792, 47.5079];
const DEFAULT_ZOOM = 6;

interface MapPickerProps {
  position?: [number, number];
  onPositionChange?: (position: [number, number]) => void;
  height?: string;
  className?: string;
}

function LocationMarker({ position }: { position?: [number, number] }) {
  return position ? <Marker position={position} icon={DefaultIcon} /> : null;
}

export default function MapPicker({
  position,
  onPositionChange,
  height = "h-64",
  className = "",
}: MapPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (
      mounted &&
      typeof window !== "undefined" &&
      mapInstance &&
      onPositionChange
    ) {
      const handleMapClick = (e: any) => {
        onPositionChange([e.latlng.lat, e.latlng.lng]);
      };

      mapInstance.on("click", handleMapClick);

      return () => {
        mapInstance.off("click", handleMapClick);
      };
    }
  }, [mounted, mapInstance, onPositionChange]);

  if (!mounted) {
    return (
      <div
        className={`${height} bg-surface border border-border rounded-lg flex items-center justify-center ${className}`}
      >
        <p className="text-text-secondary">Loading map...</p>
      </div>
    );
  }

  const center = position || DEFAULT_CENTER;
  const zoom = position ? 13 : DEFAULT_ZOOM;

  return (
    <div className={`${height} rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} />
      </MapContainer>
    </div>
  );
}
