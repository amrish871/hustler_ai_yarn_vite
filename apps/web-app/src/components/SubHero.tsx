import React, { useState } from 'react';
import { Zap, Truck, Smile, Shield, ChevronLeft, ChevronRight, Sparkles, Mic, MessageCircle, Image as ImageIcon } from 'lucide-react';

type SubHeroProps = {
  onCategorySelect?: (category: string) => void;
};

type Category = {
  name: string;
  emoji: string;
  gradient: string;
  tagline: string;
};

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get deliveries in minutes, not hours'
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'No hidden charges on orders above $10'
  },
  {
    icon: Smile,
    title: 'Best Quality',
    description: 'Curated products from trusted sellers'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Your data and payments are protected'
  }
];

const categories: Category[] = [
  {
    name: 'Groceries',
    emoji: '🛒',
    gradient: 'from-green-500 to-emerald-600',
    tagline: 'Fresh & Organic'
  },
  {
    name: 'Medicines',
    emoji: '💊',
    gradient: 'from-indigo-500 to-purple-600',
    tagline: 'Health & Wellness'
  },
  {
    name: 'Food',
    emoji: '🍕',
    gradient: 'from-orange-500 to-red-600',
    tagline: 'Fast Delivery'
  },
  {
    name: 'Beauty',
    emoji: '💄',
    gradient: 'from-pink-500 to-rose-600',
    tagline: 'Glow & Shine'
  },
  {
    name: 'Electronics',
    emoji: '📱',
    gradient: 'from-blue-500 to-cyan-600',
    tagline: 'Latest Gadgets'
  },
  {
    name: 'Books',
    emoji: '📚',
    gradient: 'from-amber-500 to-yellow-600',
    tagline: 'Knowledge Hub'
  },
  {
    name: 'Clothing',
    emoji: '👕',
    gradient: 'from-violet-500 to-purple-600',
    tagline: 'Style & Comfort'
  },
  {
    name: 'Home & Garden',
    emoji: '🏠',
    gradient: 'from-teal-500 to-green-600',
    tagline: 'Cozy Living'
  }
];

export default function SubHero({ onCategorySelect }: SubHeroProps) {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const itemsPerView = 4;
  const totalCategories = categories.length;
  const maxIndex = Math.max(0, totalCategories - itemsPerView);

  const handlePrevCategory = () => {
    setCategoryIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextCategory = () => {
    setCategoryIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleCategories = categories.slice(categoryIndex, categoryIndex + itemsPerView);

  return (
    <div className="bg-white/5 backdrop-blur-lg border-t border-white/10">
      {/* <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"></div> */}
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all border border-white/10"
              >
                <div className="mb-4 p-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Categories Carousel */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              What are you looking for?
            </h2>
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold transition-all transform hover:scale-105"
            >
              {showAllCategories ? 'Show Less' : 'Show All'}
            </button>
          </div>

          {!showAllCategories ? (
            // Carousel View - Show 2 categories
            <div className="relative">
              {/* Left Arrow */}
              <button
                onClick={handlePrevCategory}
                disabled={categoryIndex === 0}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Categories Grid - 2 columns */}
              <div className="grid grid-cols-4 gap-8 px-12">
                {visibleCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl bg-gradient-to-br ${category.gradient} hover:shadow-2xl transition-all border border-white/20 text-white font-semibold overflow-hidden group flex flex-col`}
                  >
                    {/* Background overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                    
                    {/* AI Badge */}
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-semibold">AI Order</span>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-between flex-1 p-6">
                      <div className="text-center">
                        <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                          {category.emoji}
                        </div>
                        <h3 className="text-lg font-bold">
                          {category.name}
                        </h3>
                        <p className="text-xs text-white/80 mt-1 italic">
                          {category.tagline}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-3 w-full">
                        {/* Action Icons */}
                        <div className="flex gap-2 justify-center">
                          <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110 border border-white/30" title="Use Mic">
                            <Mic className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110 border border-white/30" title="Chat">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110 border border-white/30" title="Upload Image">
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => onCategorySelect?.(category.name)}
                          className="px-6 py-2 bg-white/20 hover:bg-white/40 rounded-full text-sm font-semibold transition-all transform hover:scale-105 border border-white/30"
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                onClick={handleNextCategory}
                disabled={categoryIndex >= maxIndex}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
                aria-label="Next categories"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          ) : (
            // Grid View - Show all categories
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl bg-gradient-to-br ${category.gradient} hover:shadow-2xl transition-all border border-white/20 text-white font-semibold overflow-hidden group flex flex-col`}
                >
                  {/* Background overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                  
                  {/* AI Badge */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-xs font-semibold">AI Order</span>
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-between flex-1 p-6">
                    <div className="text-center">
                      <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">
                        {category.emoji}
                      </div>
                      <h3 className="text-lg font-bold">
                        {category.name}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 italic">
                        {category.tagline}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-3 w-full">
                      {/* Action Icons */}
                      <div className="flex gap-2 justify-center">
                        <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110 border border-white/30" title="Use Mic">
                          <Mic className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110 border border-white/30" title="Chat">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110 border border-white/30" title="Upload Image">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onCategorySelect?.(category.name)}
                        className="px-6 py-2 bg-white/20 hover:bg-white/40 rounded-full text-sm font-semibold transition-all transform hover:scale-105 border border-white/30"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Carousel Indicators - Only show in carousel view */}
          {!showAllCategories && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(totalCategories / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCategoryIndex(index * itemsPerView)}
                  className={`transition-all ${
                    Math.floor(categoryIndex / itemsPerView) === index
                      ? 'w-3 h-3 rounded-full bg-white'
                      : 'w-2 h-2 rounded-full bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to category slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
