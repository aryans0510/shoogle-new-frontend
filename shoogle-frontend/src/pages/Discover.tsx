import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ListingsGrid } from "@/components/Discover";
import useExchangeTokenAfterGoogleCallback from "@/hooks/useSetUser";
import Fuse from "fuse.js";
import api from "@/api";

const Discover = () => {
  const { setUserLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [listings, setListings] = useState<any[]>([]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Calculate filtered listings count for display
  const filteredListingsCount = useMemo(() => {
    if (!searchQuery.trim()) return listings.length;
    
    const searchLower = searchQuery.toLowerCase();
    const matches = listings.filter(listing => {
      const searchableText = [
        listing.title,
        listing.description,
        listing.category,
        ...(listing.tags || []),
        listing.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchableText.includes(searchLower);
    });
    
    if (matches.length === 0) {
      const fuse = new Fuse(listings, {
        keys: ["title", "category", "tags", "location", "description"],
        threshold: 0.4,
      });
      return fuse.search(searchQuery).length;
    }
    
    return matches.length;
  }, [listings, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/10">
      {/* Compact Professional Filter Bar */}
      {listings.length > 0 && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              {/* Category Filters */}
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
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
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Results Count */}
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {searchQuery ? (
                  <span>
                    {filteredListingsCount} results for <span className="font-medium">"{searchQuery}"</span>
                  </span>
                ) : selectedCategory ? (
                  <span>
                    {filteredListingsCount} <span className="font-medium">{selectedCategory}</span> listings
                  </span>
                ) : (
                  <span>{listings.length} listings</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-6">
        <ListingsGrid
          category={selectedCategory}
          searchQuery={searchQuery}
          showReviewRating
          showReactionButtons={true}
        />
      </div>

      {/* Compact Bottom Search Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-lg">
        <div className="mx-auto w-full max-w-4xl p-3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search products and services..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border pr-14 pl-4 text-sm font-medium"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute top-1 right-1 h-10 w-10 rounded-lg"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Discover;
