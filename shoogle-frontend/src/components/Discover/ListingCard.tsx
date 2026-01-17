import React from "react";
import { WhatsAppCTAButton } from "@/components/common";
import ListingReactionButtons from "./ListingReactionButtons";
import { Listing } from "./ListingsGrid";
import { Package, User } from "lucide-react";
import { useNavigate } from "react-router";

interface ListingCardProps {
  listing: Listing;
  customListings?: Listing[];
  highlightId?: string;
  showReviewRating?: boolean;
  showReactionButtons?: boolean;
}

function toINR(num?: number | string) {
  // Handle different price formats
  if (typeof num === "string") {
    const parsed = parseFloat(num);
    if (!isNaN(parsed)) {
      return "₹" + parsed.toLocaleString("en-IN");
    }
    return "";
  }
  if (typeof num === "number" && num > 0) {
    return "₹" + num.toLocaleString("en-IN");
  }
  return "";
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  customListings,
  highlightId,
  showReviewRating = false,
  showReactionButtons = false,
}) => {
  const navigate = useNavigate();

  // More robust price checking
  const hasValidPrice = (price: any) => {
    if (price === null || price === undefined) return false;
    if (typeof price === 'number') return price > 0;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return !isNaN(parsed) && parsed > 0;
    }
    return false;
  };

  const displayPrice = hasValidPrice(listing.price);

  // Find WhatsApp contact: from listing or profile
  const whatsappRaw =
    (listing.seller_whatsapp && listing.seller_whatsapp.trim()) ||
    (listing.profiles?.whatsapp && listing.profiles.whatsapp.trim());
  let whatsappLink = "";
  if (whatsappRaw) {
    whatsappLink = whatsappRaw.startsWith("http")
      ? whatsappRaw
      : `https://wa.me/${whatsappRaw.replace(/[^0-9]/g, "")}`;
  }

  const isHighlight = highlightId && listing.id === highlightId;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
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
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${isHighlight
        ? "border-2 border-blue-500 ring-4 ring-blue-200/50 shadow-blue-100"
        : "border border-gray-100 hover:border-gray-200"
        }`}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${listing.title}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Image/Video */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {Array.isArray(listing.media_urls) && listing.media_urls.length > 0 ? (
          listing.media_urls[0].match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={listing.media_urls[0]}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              controls={false}
              autoPlay={false}
            />
          ) : (
            <img
              src={listing.media_urls[0]}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <Package className="h-16 w-16 text-gray-300" strokeWidth={1.5} />
          </div>
        )}

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-5 p-6">
        {/* Title */}
        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {listing.title}
        </h3>

        {/* Price and Category */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {displayPrice ? (
              <div className="text-2xl font-bold text-green-600 drop-shadow-sm">{toINR(listing.price)}</div>
            ) : (
              <div className="text-lg font-semibold text-gray-500">Price on request</div>
            )}
          </div>
          {listing.category && (
            <span className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm">
              {listing.category}
            </span>
          )}
        </div>

        {/* Seller Info & Location */}
        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
          {listing.user && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                <User className="h-3 w-3 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-700">{listing.user.name || "Seller"}</span>
            </div>
          )}
          {listing.location && (
            <>
              <span className="text-gray-300">•</span>
              <span className="font-medium text-gray-600">{listing.location}</span>
            </>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="mt-auto space-y-4">
          {/* Like/Dislike Buttons */}
          {(showReactionButtons || !customListings) && (
            <div onClick={e => e.stopPropagation()}>
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
    </div>
  );
};

export default ListingCard;
