import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';

type HeroSlide = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  bgGradient: string;
  emoji?: string;
};

type HeroProps = {
  onGetStarted?: () => void;
  onSearch?: (query: string) => void;
};

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Shop Everything,',
    subtitle: 'Anytime, Anywhere',
    description: 'Experience the fastest delivery service with AI-powered recommendations. Get your groceries, medicines, food, and more delivered to your doorstep.',
    gradient: 'from-yellow-300 to-orange-300',
    bgGradient: 'from-purple-600 via-blue-600 to-indigo-600',
    emoji: '🛒'
  },
  {
    id: 2,
    title: 'Lightning Fast',
    subtitle: 'Delivery in Minutes',
    description: 'Skip the waiting lines. Get what you need delivered to your door in just minutes with our express delivery service.',
    gradient: 'from-pink-300 to-red-300',
    bgGradient: 'from-rose-600 via-pink-600 to-purple-600',
    emoji: '⚡'
  },
  {
    id: 3,
    title: 'AI-Powered',
    subtitle: 'Smart Shopping Assistant',
    description: 'Let our intelligent shopping assistant recommend products based on your preferences and budget. Shop smarter, not harder.',
    gradient: 'from-cyan-300 to-blue-300',
    bgGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    emoji: '🤖'
  },
  {
    id: 4,
    title: 'Multiple Categories',
    subtitle: 'All in One Place',
    description: 'Groceries, medicines, food, beauty, electronics and more. Everything you need is just a click away.',
    gradient: 'from-green-300 to-emerald-300',
    bgGradient: 'from-green-600 via-emerald-600 to-teal-600',
    emoji: '🏪'
  }
];

export default function Hero({ onGetStarted, onSearch }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-rotate slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setSearchQuery('');
    }
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className={`relative bg-gradient-to-r ${slide.bgGradient} text-white overflow-hidden transition-all duration-1000 px-4 sm:px-4 lg:px-8`}>
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Search Bar Overlay */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center max-w-2xl mx-auto relative">
              <input
                type="text"
                placeholder="Search for products, stores, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-6 pr-14 py-4 rounded-full bg-white/20 border-2 border-white/30 hover:border-white/50 focus:border-white focus:outline-none text-white placeholder-white/60 transition-all backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-1 p-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 hover:from-purple-500 hover:to-blue-500 transition-all text-white shadow-lg"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          {/* Emoji */}
          {slide.emoji && (
            <div className="text-5xl sm:text-6xl mb-2 animate-bounce">
              {slide.emoji}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
            {slide.title}
            <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${slide.gradient}`}>
              {slide.subtitle}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
            {slide.description}
          </p>

          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-800 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-all text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-all text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all ${
              index === currentSlide
                ? 'w-8 h-3 rounded-full bg-white'
                : 'w-3 h-3 rounded-full bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
