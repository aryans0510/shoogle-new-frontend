import React, { useEffect, useState, useMemo } from "react";
import { Package } from "lucide-react";
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
  customListings?: Listing[];
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
        console.error("Error fetching listings:", err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category, customListings]);

  // Simple search filtering
  const filteredListings = useMemo(() => {
    if (customListings) {
      return listings;
    }

    if (!searchQuery.trim()) {
      return listings;
    }

    const searchLower = searchQuery.toLowerCase();

    // Simple text matching
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

    // If no simple matches, try fuzzy search
    if (matches.length === 0) {
      const fuse = new Fuse(listings, {
        keys: ["title", "category", "tags", "location", "description"],
        threshold: 0.4,
      });

      const fuzzyResults = fuse.search(searchQuery);
      return fuzzyResults.map(result => result.item);
    }

    return matches;
  }, [listings, searchQuery, customListings]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
          <Loader />
          <p className="mt-8 text-gray-600 font-semibold text-lg">Discovering amazing listings...</p>
          <p className="mt-2 text-gray-400 text-sm">Please wait while we fetch the best deals for you</p>
        </div>
      </div>
    );
  }

  if (!loading && filteredListings.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-8 py-16 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Package className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No listings found</h3>
          {searchQuery ? (
            <div className="space-y-3">
              <p className="text-gray-600 text-lg">
                No matches for <span className="font-semibold text-gray-800">"{searchQuery}"</span>
              </p>
              <p className="text-gray-500">
                Try different keywords, check spelling, or browse our categories
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-lg">No listings available at the moment</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4">
      {/* Listings Grid - No header needed since it's in the filter bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredListings.map((listing) => (
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
