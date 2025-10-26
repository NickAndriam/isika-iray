"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Crosshair, ZoomIn, ZoomOut } from "lucide-react";
import MapPicker from "./MapPicker";
import { useRouter } from "next/navigation";

interface LocationSelectorProps {
  currentLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  onCancel?: () => void;
}

export default function LocationSelector({
  currentLocation,
  onLocationSelect,
  onCancel,
}: LocationSelectorProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [position, setPosition] = useState<[number, number] | undefined>(
    currentLocation ? [currentLocation.lat, currentLocation.lng] : undefined
  );
  const [address, setAddress] = useState("");

  const handlePositionChange = (newPosition: [number, number]) => {
    setPosition(newPosition);
    // In a real app, you would reverse geocode to get the address
    setAddress(`${newPosition[0].toFixed(4)}, ${newPosition[1].toFixed(4)}`);
  };

  const handleConfirm = () => {
    if (position) {
      onLocationSelect({ lat: position[0], lng: position[1] });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setPosition(newPos);
          handlePositionChange(newPos);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="font-semibold text-text-primary mb-2">
          {t("selectLocation")}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t("selectLocationDescription")}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-surface transition-colors"
          >
            <Crosshair size={16} className="text-primary-green" />
            {t("useCurrentLocation")}
          </motion.button>
        </div>

        {/* Map */}
        <MapPicker
          position={position}
          onPositionChange={handlePositionChange}
          height="h-96"
        />

        {/* Selected Location Info */}
        {position && (
          <div className="mt-4 p-3 bg-white border border-border rounded-lg flex items-center gap-2">
            <MapPin size={18} className="text-primary-green" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">
                {t("selectedLocation")}
              </p>
              <p className="text-xs text-text-secondary">
                {address ||
                  `${position[0].toFixed(4)}, ${position[1].toFixed(4)}`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-border rounded-lg text-text-primary hover:bg-surface transition-colors"
          >
            {t("cancel")}
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={!position}
          className="flex-1 py-3 px-4 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t("confirmLocation")}
        </motion.button>
      </div>
    </div>
  );
}
