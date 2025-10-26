"use client";

import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface LocationMapProps {
  region: string;
  commune?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  showCoordinates?: boolean;
  height?: string;
  className?: string;
}

export default function LocationMap({
  region,
  commune,
  coordinates,
  showCoordinates = true,
  height = "h-64",
  className = "",
}: LocationMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <div
        className={`bg-surface border border-border rounded-lg flex items-center justify-center relative ${height}`}
      >
        <div className="text-center">
          <MapPin size={48} className="text-primary-green mx-auto mb-2" />
          <p className="text-sm text-text-primary font-medium mb-1">
            {region}
            {commune && `, ${commune}`}
          </p>
          {showCoordinates && coordinates && (
            <p className="text-xs text-text-secondary">
              {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
