import React, { useEffect, useState, useMemo } from "react";
import { Search, Package, AlertCircle } from "lucide-react";
import ListingCard from "./ListingCard";
import { Loader } from "@/components/common";
import Fuse from "fuse.js";
import api from "@/api";

export interface Listing {
  id: string;
  title: string;
  description?: string;
  category: string;
  type?: string;
  price?: number;
  location?: string;
  tags?: string[];
  user_id: string;
  user?: {
    id: string;
    name: string;
  };
  profiles?: {
    whatsapp?: string | null;
  };
  seller_whatsapp?: string | null;
  media_urls?: string[] | null;
  average_rating?: number;
  review_count?: number;
  status?: string;
  like_count?: number;
  dislike_count?: number;
}

interface ListingsGridProps {
  category: string | null;
  searchQuery: string;
  customListings?: Listing[]; // Optional: for specific seller feed
  highlightId?: string;
  showReviewRating?: boolean;
  showReactionButtons?: boolean;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({
  category,
  searchQuery,
  customListings,
  highlightId,
  showReviewRating = false,
  showReactionButtons = false,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract search term and location for summary
  const searchTerm = searchQuery ? searchQuery.trim() : "";
  let terms = searchTerm.split(" in ");
  let itemTerm = terms[0];
  let locTerm: string | undefined = terms[1]?.trim();

  useEffect(() => {
    if (customListings) {
      setListings(customListings);
      return;
    }

    const fetchListings = async () => {
      setLoading(true);
      try {
        const params: any = {
          limit: 100,
          visible_in_discovery: true,
        };
        
        if (category) {
          params.category = category;
        }

        const response = await api.get("/listing/public", { params });

        if (response.data?.success && response.data?.data?.listings) {
          setListings(response.data.data.listings || []);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching listings:", err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, customListings]);

  // Ranking algorithm based on likes, reviews, and engagement
  const calculateListingScore = (listing: Listing): number => {
    let score = 0;

    // Like/Dislike ratio (40% weight)
    const likeCount = listing.like_count || 0;
    const dislikeCount = listing.dislike_count || 0;
    const totalReactions = likeCount + dislikeCount;
    if (totalReactions > 0) {
      const likeRatio = likeCount / totalReactions;
      score += likeRatio * 40;
    }

    // Average rating (30% weight)
    if (listing.average_rating) {
      score += (listing.average_rating / 5) * 30;
    }

    // Review count (20% weight) - more reviews = more trusted
    const reviewCount = listing.review_count || 0;
    const reviewScore = Math.min(reviewCount / 10, 1); // Cap at 10 reviews for max score
    score += reviewScore * 20;

    // Engagement bonus (10% weight) - listings with any interaction
    if (totalReactions > 0 || reviewCount > 0) {
      score += 10;
    }

    return score;
  };

  // Fuzzy search on client-side for better matching
  const filteredListings = useMemo(() => {
    // If customListings provided, respect the order (for seller profiles with custom sorting)
    if (customListings) {
      return listings;
    }

    if (!searchQuery.trim()) {
      // No search query - return all listings sorted by rank
      return [...listings].sort((a, b) => calculateListingScore(b) - calculateListingScore(a));
    }
    const searchLower = searchQuery.toLowerCase();

    // Remove common filler words for better matching
    const fillerWords = [
      "search",
      "for",
      "find",
      "looking",
      "browse",
      "explore",
      "in",
      "near",
      "nearby",
      "around",
      "me",
    ];
    const cleanedQuery = searchLower
      .split(/\s+/)
      .filter(word => !fillerWords.includes(word) && word.length > 1)
      .join(" ");

    const queryToUse = cleanedQuery || searchLower;

    // First pass: exact word matching in any field (highest priority)
    const exactMatches = listings.filter(listing => {
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

      // Split search by spaces and find words
      const searchWords = queryToUse.split(/\s+/).filter(w => w.length > 1);

      // Check if at least 70% of words match
      const matchedWords = searchWords.filter(word => searchableText.includes(word));
      return matchedWords.length >= Math.ceil(searchWords.length * 0.7);
    });

    // If exact matches found, return them sorted by rank
    if (exactMatches.length > 0) {
      return exactMatches.sort((a, b) => calculateListingScore(b) - calculateListingScore(a));
    }

    // Second pass: fuzzy matching for typos and partial matches
    const fuse = new Fuse(listings, {
      keys: [
        { name: "title", weight: 1.0 },
        { name: "category", weight: 0.9 },
        { name: "tags", weight: 0.7 },
        { name: "location", weight: 0.6 },
        { name: "description", weight: 0.4 },
      ],
      threshold: 0.4, // More strict threshold for better accuracy
      includeScore: true,
      minMatchCharLength: 2, // Require at least 2 characters to match
      ignoreLocation: true,
      useExtendedSearch: false,
      findAllMatches: true,
    });

    const fuzzyResults = fuse.search(queryToUse);

    // If no results with cleaned query, try original query
    if (fuzzyResults.length === 0 && queryToUse !== searchLower) {
      const fallbackResults = fuse.search(searchLower);
      const rankedFallback = fallbackResults.map(result => result.item);
      return rankedFallback.sort((a, b) => calculateListingScore(b) - calculateListingScore(a));
    }

    // Sort fuzzy results by ranking score
    const rankedResults = fuzzyResults.map(result => result.item);
    return rankedResults.sort((a, b) => calculateListingScore(b) - calculateListingScore(a));
  }, [listings, searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!loading && filteredListings.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" strokeWidth={1.5} />
          <p className="text-lg font-medium text-gray-600">No listings found</p>
          {searchQuery && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              <span>Try adjusting your search</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Summary Bar
  return (
    <div className="my-6 sm:my-8">
      {!customListings && (
        <div className="mb-4 flex flex-col items-start gap-2 rounded-2xl bg-[#f4f8fb] px-4 py-3 sm:mb-6 sm:flex-row sm:items-center sm:gap-3 sm:px-6 sm:py-4">
          <Search className="mb-1 h-5 w-5 shrink-0 text-blue-500 sm:mb-0" />
          <div className="text-base font-medium text-gray-700 md:text-lg">
            Found {filteredListings.length}{" "}
            {(() => {
              const searchTerm = searchQuery ? searchQuery.trim() : "";
              let terms = searchTerm.split(" in ");
              let itemTerm = terms[0];
              let locTerm: string | undefined = terms[1]?.trim();
              return (
                <>
                  {itemTerm ? (
                    <span className="font-semibold">
                      {itemTerm}
                      {locTerm ? "" : listings.length === 1 ? "" : "s"}
                    </span>
                  ) : (
                    "results"
                  )}
                  {locTerm ? (
                    <>
                      {" "}
                      in <span className="font-semibold">{locTerm}</span>
                    </>
                  ) : null}
                  ! Here are the best matches:
                </>
              );
            })()}
          </div>
        </div>
      )}
      {/* Listings cards - Improved grid with consistent sizing */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {filteredListings.map(listing => (
          <ListingCard
            key={listing.id}
            listing={listing}
            customListings={customListings}
            highlightId={highlightId}
            showReviewRating={showReviewRating}
            showReactionButtons={showReactionButtons}
          />
        ))}
      </div>
    </div>
  );
};

export default ListingsGrid;
