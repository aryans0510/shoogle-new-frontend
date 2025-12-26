import React, { useMemo, useState } from "react";
import { ArrowUpDown, Filter } from "lucide-react";
import ListingsGrid from "@/components/Discover/ListingsGrid";

const SellerProfileListings = ({
  profile,
  sellerListings,
  highlightListingId,
}: {
  profile: any;
  sellerListings: any[];
  highlightListingId: string | null;
}) => {
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"price" | "review" | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const categories: string[] = useMemo(() => {
    const cats = new Set<string>();
    sellerListings.forEach(l => (l.category ? cats.add(l.category) : null));
    return Array.from(cats);
  }, [sellerListings]);

  const filteredListings = useMemo(() => {
    // First, filter by category
    let filtered = sellerListings.filter(l => (catFilter ? l.category === catFilter : true));

    // Then apply sorting based on selected criteria and direction
    const sorted = [...filtered]; // Create copy to avoid mutation

    if (sortOrder === "price") {
      // Price: asc = low to high, desc = high to low
      sorted.sort((a, b) => {
        const priceA = Number(a.price || 0);
        const priceB = Number(b.price || 0);
        return sortDir === "asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (sortOrder === "review") {
      // Reviews: desc = most reviewed first, asc = least reviewed first
      sorted.sort((a, b) => {
        const countA = a.review_count ?? 0;
        const countB = b.review_count ?? 0;
        return sortDir === "asc" ? countA - countB : countB - countA;
      });
    } else {
      // Created date: desc = newest first, asc = oldest first
      sorted.sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return sortDir === "asc" ? timeA - timeB : timeB - timeA;
      });
    }

    return sorted;
  }, [sellerListings, catFilter, sortOrder, sortDir]);

  return (
    <div className="mx-auto mt-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Listings from {profile.full_name || "this seller"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"}
        </p>
      </div>

      {/* Filter & Sort Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={catFilter ?? ""}
            onChange={e => setCatFilter(e.target.value || null)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-400" />
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="created_at">Newest First</option>
            <option value="price">Price</option>
            <option value="review">Most Reviewed</option>
          </select>
          <button
            aria-label="Toggle sort direction"
            onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="text-base">{sortDir === "asc" ? "↑" : "↓"}</span>
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <ListingsGrid
        category={null}
        searchQuery={""}
        customListings={filteredListings}
        highlightId={highlightListingId}
        showReviewRating
        showReactionButtons={true}
      />
    </div>
  );
};

export default SellerProfileListings;
