"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export default function ImageGallery({
  images,
  alt,
  className = "",
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="aspect-video bg-border">
          <img
            src={images[currentIndex]}
            alt={alt}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowModal(true)}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              disabled={currentIndex === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full"
          >
            <X size={24} />
          </button>

          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <img
              src={images[currentIndex]}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full disabled:opacity-50"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 text-white rounded-full disabled:opacity-50"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
