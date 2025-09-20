'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, ExternalLink } from 'lucide-react';

const TipCard = ({ tip, isActive, onClick }) => {
  return (
    <div 
      className={`
        flex-shrink-0 w-full p-6 rounded-xl border-2 cursor-pointer transition-all
        ${isActive 
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-green-100 hover:shadow-sm'
        }
      `}
      onClick={() => onClick(tip)}
    >
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
          {tip.category}
        </div>
        <div className="flex text-yellow-400">
          {[...Array(tip.impact)].map((_, i) => (
            <Lightbulb key={i} className="h-3 w-3 fill-current" />
          ))}
        </div>
      </div>
      
      {/* Tip Content */}
      <h4 className="font-semibold text-gray-800 mb-2 text-sm">
        {tip.title}
      </h4>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {tip.description}
      </p>
      
      {/* Potential Savings */}
      <div className="bg-green-100 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-green-700">Potential Impact</span>
          <span className="text-sm font-bold text-green-800">{tip.savings}</span>
        </div>
      </div>
      
      {/* Action Link */}
      {tip.actionUrl && (
        <button className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
          <span>Learn more</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default function TipsCarousel({ tips = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || tips.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, tips.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tips.length);
    setIsAutoPlaying(false);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleTipClick = (tip) => {
    if (tip.actionUrl) {
      window.open(tip.actionUrl, '_blank');
    }
  };

  if (tips.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No tips available</h3>
        <p className="text-gray-500">Check back later for sustainability tips!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Eco Tips</h3>
        </div>
        
        {/* Autoplay Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`
              text-xs px-2 py-1 rounded-full transition-colors
              ${isAutoPlaying 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
              }
            `}
          >
            {isAutoPlaying ? 'Auto' : 'Manual'}
          </button>
        </div>
      </div>
      
      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        {tips.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 z-10 
                       bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg 
                       transition-all hover:bg-gray-50"
              disabled={tips.length <= 1}
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 z-10 
                       bg-white border border-gray-200 rounded-full p-2 shadow-md hover:shadow-lg 
                       transition-all hover:bg-gray-50"
              disabled={tips.length <= 1}
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </>
        )}
        
        {/* Tip Display */}
        <div className="overflow-hidden">
          <TipCard
            tip={tips[currentIndex]}
            isActive={true}
            onClick={handleTipClick}
          />
        </div>
        
        {/* Dot Indicators */}
        {tips.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {tips.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${index === currentIndex 
                    ? 'bg-green-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Tip Counter */}
      <div className="text-center mt-4">
        <span className="text-xs text-gray-500">
          Tip {currentIndex + 1} of {tips.length}
        </span>
      </div>
    </div>
  );
}
