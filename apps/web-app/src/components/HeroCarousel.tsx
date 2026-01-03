import React, { useState, useRef } from 'react';
import { Mic, MessageSquare, Store, Image, Camera } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';

type HeroCarouselProps = {
  carouselSlides: Array<{
    id: number;
    title: string;
    image: string;
    description: string;
    color: string;
  }>;
  carouselIndex: number;
  setCarouselIndex: (index: number) => void;
  isListening: boolean;
  toggleListening: () => void;
  setShowConversation: (show: boolean) => void;
  setShowStoreSearch: (show: boolean) => void;
  setShowMediaOptions: (show: boolean) => void;
  showMediaOptions: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
};

export default function HeroCarousel({
  carouselSlides,
  carouselIndex,
  setCarouselIndex,
  isListening,
  toggleListening,
  setShowConversation,
  setShowStoreSearch,
  setShowMediaOptions,
  showMediaOptions,
  fileInputRef,
  cameraInputRef,
  onTouchStart,
  onTouchEnd,
}: HeroCarouselProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const goPrev = () =>
    setCarouselIndex(
      (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length
    );
  const goNext = () => setCarouselIndex((carouselIndex + 1) % carouselSlides.length);

  return (
    <div className="w-full mb-5 relative">
      <div
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="overflow-hidden rounded-3xl"
      >
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
        >
          {carouselSlides.map((slide) => (
            <div
              key={slide.id}
              className={`min-w-full p-8 bg-gradient-to-br ${slide.color} rounded-3xl relative`}
            >
              <div className="flex flex-col items-center text-center w-full">
                <div className="text-6xl mb-4">{slide.image}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {slide.title}
                </h3>
                <p className="text-blue-200 text-sm mb-6">
                  {slide.description}
                </p>
                {/* Mic Button */}
                <div className="mb-4">
                  <div className="relative">
                    {isListening && (
                      <>
                        <div className="absolute inset-0 animate-ping">
                          <div className="w-28 h-28 rounded-full bg-blue-400/30"></div>
                        </div>
                        <div className="absolute inset-0 animate-pulse">
                          <div className="w-28 h-28 rounded-full bg-purple-400/20"></div>
                        </div>
                      </>
                    )}
                    <button
                      onClick={toggleListening}
                      className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isListening
                          ? "bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/50"
                          : "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50"
                      } hover:scale-110`}
                    >
                      <Mic className="w-12 h-12 text-white" />
                    </button>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConversation(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => setShowStoreSearch(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-105 text-sm"
                  >
                    <Store className="w-4 h-4" />
                    <span>Browse</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowMediaOptions(!showMediaOptions)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <Image className="w-4 h-4" />
                      <span>Image</span>
                    </button>
                    {showMediaOptions && (
                      <div className="absolute top-12 left-0 bg-white/10 backdrop-blur-lg rounded-2xl p-2 shadow-xl z-10">
                        <button
                          onClick={() => {
                            cameraInputRef.current?.click();
                            setShowMediaOptions(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-white w-full whitespace-nowrap text-sm"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Take Photo</span>
                        </button>
                        <button
                          onClick={() => {
                            fileInputRef.current?.click();
                            setShowMediaOptions(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-colors text-white w-full whitespace-nowrap text-sm"
                        >
                          <Image className="w-4 h-4" />
                          <span>Upload Image</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl"
      >
        ›
      </button>

      <div className="flex items-center justify-center gap-2 mt-3">
        {carouselSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCarouselIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              carouselIndex === i ? "bg-white w-8" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
