import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeatureBox {
  id: string;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

interface FeatureCarouselProps {
  features: FeatureBox[];
  onFeatureClick?: (feature: FeatureBox) => void;
  className?: string;
}

/**
 * FeatureCarousel Component
 *
 * A compact, minimalist horizontal scrollable carousel of feature boxes.
 * Dynamically generates content from listings.
 *
 * @param features - Array of feature boxes to display
 * @param onFeatureClick - Callback when a feature box is clicked
 * @param className - Optional additional CSS classes
 */
const FeatureCarousel: React.FC<FeatureCarouselProps> = ({
  features,
  onFeatureClick,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to show/hide navigation arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll carousel left
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  // Scroll carousel right
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  // Handle feature click
  const handleFeatureClick = (feature: FeatureBox) => {
    feature.onClick?.();
    onFeatureClick?.(feature);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={handleScrollLeft}
          className="absolute top-1/2 left-0 z-10 -translate-x-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-background to-transparent p-1 text-gray-500 transition-all hover:text-primary"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth px-2"
        style={{ scrollBehavior: "smooth" }}
      >
        {features.map(feature => (
          <button
            key={feature.id}
            onClick={() => handleFeatureClick(feature)}
            className="group relative min-w-[140px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-300 bg-white p-3 shadow-sm transition-all duration-200 hover:border-primary hover:bg-white hover:shadow-md active:scale-95"
          >
            {/* Content */}
            <div className="relative z-10">
              {/* Title */}
              <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 transition-colors group-hover:text-primary">
                {feature.title}
              </h3>

              {/* Subtitle */}
              {feature.subtitle && (
                <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 transition-colors group-hover:text-gray-700">
                  {feature.subtitle}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={handleScrollRight}
          className="absolute top-1/2 right-0 z-10 translate-x-3 -translate-y-1/2 rounded-full bg-gradient-to-l from-background to-transparent p-1 text-gray-500 transition-all hover:text-primary"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Hide scrollbar CSS */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FeatureCarousel;
