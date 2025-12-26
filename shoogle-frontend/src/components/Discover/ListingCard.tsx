import React from "react";
import { WhatsAppCTAButton } from "@/components/common";
import ListingReactionButtons from "./ListingReactionButtons";
import { Listing } from "./ListingsGrid";
import { Package, User } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

interface ListingCardProps {
  listing: Listing;
  customListings?: Listing[];
  highlightId?: string;
  showReviewRating?: boolean;
  showReactionButtons?: boolean;
}

function toINR(num?: number) {
  if (typeof num !== "number") return "";
  return "₹" + num.toLocaleString("en-IN");
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  customListings,
  highlightId,
  showReviewRating = false,
  showReactionButtons = false,
}) => {
  const navigate = useNavigate();

  // Find WhatsApp contact: from listing or profile
  const whatsappRaw =
    (listing.seller_whatsapp && listing.seller_whatsapp.trim()) ||
    (listing.profiles?.whatsapp && listing.profiles.whatsapp.trim()); // fallback to profile
  let whatsappLink = "";
  if (whatsappRaw) {
    whatsappLink = whatsappRaw.startsWith("http")
      ? whatsappRaw
      : `https://wa.me/${whatsappRaw.replace(/[^0-9]/g, "")}`;
  }
  // Highlight if selected (from link)
  const isHighlight = highlightId && listing.id === highlightId;

  // Click handlers - always navigate to listing detail page for buyers
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    // Always navigate to listing detail page - buyers want to see listing details
    navigate(`/listing/${listing.id}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/listing/${listing.id}`);
    }
  };

  return (
    <div
      key={listing.id}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${isHighlight ? "z-10 border-blue-500 shadow-lg ring-2 ring-blue-500" : "border-gray-200 shadow-sm hover:border-gray-300"} `}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${listing.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Image/Video - Fixed aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {Array.isArray(listing.media_urls) && listing.media_urls.length > 0 ? (
          listing.media_urls[0].match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={listing.media_urls[0]}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              controls={false}
              autoPlay={false}
            />
          ) : (
            <img
              src={listing.media_urls[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Package className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
          </div>
        )}

        {/* Status Badge */}
        {listing.status && listing.status !== "active" && (
          <div className="absolute top-2 right-2">
            <span className="rounded-md bg-gray-800/90 px-2 py-1 text-xs font-medium tracking-wide text-white uppercase backdrop-blur-sm">
              {listing.status}
            </span>
          </div>
        )}
      </div>

      {/* Content Section - Better spacing and sizing */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {/* Title - Consistent line height */}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight font-semibold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-base">
          {listing.title}
        </h3>

        {/* Price and Category */}
        <div className="flex items-center justify-between gap-2">
          {listing.price !== undefined && listing.price !== null && (
            <div className="text-lg font-bold text-gray-900 sm:text-xl">{toINR(listing.price)}</div>
          )}
          {listing.category && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {listing.category}
            </span>
          )}
        </div>

        {/* Rating Section */}
        {showReviewRating && (
          <div className="flex items-center gap-2 text-sm">
            {listing.average_rating ? (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900">
                  {Number(listing.average_rating).toFixed(1)}
                </span>
                <span className="text-yellow-500">★</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400">No ratings</span>
            )}

            {(listing.review_count ?? 0) > 0 && (
              <span className="text-xs text-gray-500">({listing.review_count})</span>
            )}
          </div>
        )}

        {/* Seller Info & Location */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {listing.user && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{listing.user.name || "Seller"}</span>
            </div>
          )}
          {listing.location && (
            <>
              <span>•</span>
              <span>{listing.location}</span>
            </>
          )}
        </div>

        {/* Like/Dislike Buttons */}
        {(showReactionButtons || !customListings) && (
          <div className="mt-auto" onClick={e => e.stopPropagation()}>
            <ListingReactionButtons
              listingId={listing.id}
              initialLikeCount={listing.like_count || 0}
              initialDislikeCount={listing.dislike_count || 0}
              size="sm"
            />
          </div>
        )}

        {/* WhatsApp CTA */}
        {whatsappLink && (
          <div onClick={e => e.stopPropagation()}>
            <WhatsAppCTAButton whatsappLink={whatsappLink} />
          </div>
        )}
      </div>
    </div>
  );
};
export default ListingCard;
