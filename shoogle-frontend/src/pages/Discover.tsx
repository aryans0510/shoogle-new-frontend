import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { ListingsGrid, FeatureCarousel, WelcomeTransition } from "@/components/Discover";
import useExchangeTokenAfterGoogleCallback from "@/hooks/useSetUser";
import { getFirstName } from "@/utils";
import api from "@/api";

// Add this helper hook:
function useIsMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 640;
}

const Discover = () => {
  const { user, setUserLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(false); // Show listings by default
  const [hasSearched, setHasSearched] = useState(true); // Start with listings visible

  // Fetch listings to dynamically generate categories

  useExchangeTokenAfterGoogleCallback("user");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get("/listing/public", {
          params: {
            limit: 50,
            visible_in_discovery: true,
          },
        });

        if (response.data?.success && response.data?.data?.listings) {
          setListings(response.data.data.listings || []);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]);
      } finally {
        setUserLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Dynamically generate feature boxes from listings with search prompts
  const featureBoxes = useMemo(() => {
    if (listings.length === 0) {
      return [];
    }

    // Group by category and collect sample listings
    const categoryMap = new Map<string, any[]>();
    listings.forEach(listing => {
      const category = listing.category || "Other";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(listing);
    });

    // Convert to array and sort by count (most popular first)
    const sortedCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 8) // Limit to 8 categories for carousel
      .map(([category, categoryListings]) => {
        // Get sample listing info for context
        const sampleListing = categoryListings[0];
        const location = sampleListing?.location || "nearby";
        const title = sampleListing?.title || category;

        // Create search prompts using actual listing data
        const prompts = [
          `Search for ${category.toLowerCase()} in ${location}`,
          `Looking for ${title}?`,
          `Find ${category.toLowerCase()} near me`,
          `Browse ${category.toLowerCase()} listings`,
          `Explore ${category.toLowerCase()} in ${location}`,
        ];

        // Pick a random prompt for variety
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

        return {
          id: category.toLowerCase().replace(/\s+/g, "-"),
          title: category,
          subtitle: randomPrompt,
        };
      });

    return sortedCategories;
  }, [listings]);

  // mobile hydration avoidance
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  // Responsive tweak: Use media query for mobile layout adjustments
  // Optionally, could use custom hook `useIsMobile`
  // But for safety for SSR, simple fallback below:
  const isMobile = hydrated && window.innerWidth < 640;

  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowWelcome(false);
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-background via-shopgpt-50/30 to-magic-50/20">
      {/* Category Filter Chips */}
      {!showWelcome && listings.length > 0 && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 sm:pt-8">
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
              }`}
            >
              All Categories
            </button>
            {Array.from(new Set(listings.map(l => l.category).filter(Boolean))).map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery("");
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content - WelcomeTransition OR ListingsGrid */}
      <div className="mx-auto w-full max-w-6xl px-4 pt-5 pb-40 sm:px-6 sm:pt-8">
        {showWelcome ? (
          <WelcomeTransition
            username={getFirstName()}
            onContinue={() => {
              setShowWelcome(false);
              setHasSearched(true);
            }}
            showListings={false}
          />
        ) : hasSearched ? (
          <ListingsGrid
            key={`${selectedCategory}-${searchQuery}`}
            category={selectedCategory}
            searchQuery={searchQuery}
            showReviewRating
            showReactionButtons={true}
          />
        ) : null}
      </div>

      {/* Bottom Search Bar - ChatGPT Style */}
      <div className="fixed right-0 bottom-0 left-0 z-20">
        <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
          {/* Feature Carousel - No Background */}
          {showSuggestions && featureBoxes.length > 0 && (
            <div className="relative mb-4">
              <button
                onClick={() => setShowSuggestions(false)}
                className="absolute -top-2 -right-2 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm transition-all hover:border-primary hover:bg-primary hover:text-white"
                aria-label="Close suggestions"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <FeatureCarousel
                features={featureBoxes}
                onFeatureClick={feature => {
                  // Set search query to the prompt (which contains the category and location)
                  setSearchQuery(feature.subtitle || feature.title);
                  // Clear category filter to allow fuzzy search to work
                  setSelectedCategory(null);
                  // Hide welcome screen and mark as searched
                  setShowWelcome(false);
                  setHasSearched(true);
                }}
              />
            </div>
          )}

          {/* Search Input - Separate Card */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Input
                type="text"
                placeholder="I'm looking for a used iPhone in Mumbai..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsActive(true)}
                onBlur={() => setIsActive(false)}
                className={`h-12 rounded-2xl border-2 bg-white pr-14 pl-6 text-base shadow-sm transition-all duration-200 ${
                  isActive ? "border-primary/50 shadow-lg" : "border-gray-200"
                }`}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-xl"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Discover;
