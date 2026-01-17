import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, User } from "lucide-react";
import { WhatsAppCTAButton, ContactCTAButton } from "@/components/common";
import { ListingReviewsSection } from "@/components/listings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import api from "@/api";

// Helper to format price in INR
function toINR(num?: number | string) {
  if (!num || isNaN(Number(num))) return "";
  return "₹" + Number(num).toLocaleString("en-IN");
}

const ListingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Detect if the user is using a share link
  const isViaShare = useMemo(() => {
    return new URLSearchParams(location.search).get("shared") === "1";
  }, [location.search]);

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      console.log("Fetching listing with ID:", id);

      try {
        // Fetch the listing from backend
        const response = await api.get(`/listing/${id}`);
        
        if (response.data?.success && response.data?.data) {
          const listingData = response.data.data;
          setListing(listingData);

          // Fetch seller profile if user_id exists
          if (listingData.user_id) {
            try {
              const sellerResponse = await api.get(`/user/seller-profile/${listingData.user_id}`);
              if (sellerResponse.data?.success && sellerResponse.data?.data) {
                setSellerProfile(sellerResponse.data.data);
              }
            } catch (profileError) {
              console.error("Error fetching seller profile:", profileError);
              // Don't fail if profile fetch fails
            }
          }
        } else {
          setListing(null);
        }
      } catch (error: any) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchListing();
  }, [id]);

  // Ownership check
  const isOwner = user && listing && user.id === listing.user_id;

  console.log("Access check:", {
    listing: !!listing,
    status: listing?.status,
    isOwner,
    isViaShare,
    userId: user?.id,
    listingUserId: listing?.user_id,
  });

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground sm:p-8">Loading...</div>;
  }

  // Allow access if listing exists and is active, OR if user is owner, OR if via share link
  if (!listing) {
    return <div className="p-4 text-center text-red-500 sm:p-8">Listing not found.</div>;
  }

  // Allow viewing if listing is active OR user is owner OR via share link
  if (listing.status !== "active" && !isOwner && !isViaShare) {
    return (
      <div className="p-4 text-center text-red-500 sm:p-8">
        This listing is not currently available.
      </div>
    );
  }

  // Prepare WhatsApp link (prioritize listing seller_whatsapp, fallback to profile whatsapp)
  const whatsappRaw = listing.seller_whatsapp || sellerProfile?.whatsapp || "";
  const whatsappLink = whatsappRaw
    ? whatsappRaw.startsWith("http")
      ? whatsappRaw
      : `https://wa.me/${whatsappRaw.replace(/[^0-9]/g, "")}`
    : "";

  // Prepare phone call link (from profile)
  const phoneRaw = sellerProfile?.mobile_number || "";
  const phoneLink = phoneRaw ? `tel:${phoneRaw.replace(/[^0-9+]/g, "")}` : "";

  // Helper to render images/videos:
  function renderMedia(url: string, idx: number) {
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
    if (isVideo) {
      return (
        <video
          key={idx}
          src={url}
          className="max-h-60 w-full rounded-xl object-cover"
          controls
          style={{ backgroundColor: "#eef4ff" }}
        />
      );
    } else {
      return (
        <img
          key={idx}
          src={url}
          alt={"Media " + (idx + 1)}
          className="max-h-60 w-full rounded-xl object-cover"
          style={{ backgroundColor: "#eef4ff" }}
        />
      );
    }
  }

  // Share button logic
  const handleClickShare = () => {
    // Always generate link with ?shared=1
    const baseUrl = window.location.origin + "/listing/" + listing.id + "?shared=1";
    navigator.clipboard.writeText(baseUrl);
    toast.success("Link copied!", {
      description: "Share this link to invite reviews and boost your listing's visibility.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header with Back and Share */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-lg hover:bg-white"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {isOwner && (
            <Button
              variant="outline"
              className="rounded-lg font-medium"
              onClick={handleClickShare}
              aria-label="Share this Listing"
            >
              <Copy className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}
        </div>

        {/* Main Content Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {/* Media Gallery - Enhanced Layout */}
          {Array.isArray(listing.media_urls) && listing.media_urls.length > 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {listing.media_urls.map((url: string, i: number) => (
                  <div key={i} className="overflow-hidden rounded-xl bg-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    {url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video src={url} className="h-64 w-full object-cover" controls />
                    ) : (
                      <img src={url} alt={"Media " + (i + 1)} className="h-64 w-full object-cover hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="space-y-6 p-5 sm:space-y-7 sm:p-7">
            {/* Title, Price and Category */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="flex-1 text-2xl leading-tight font-bold text-gray-900 sm:text-3xl">
                  {listing.title}
                </h1>
                {listing.category && (
                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    {listing.category}
                  </span>
                )}
              </div>

              {listing.price !== undefined && listing.price !== null && (
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-green-600">{toINR(listing.price)}</div>
                  <span className="text-sm text-gray-500 bg-gray-100 rounded-lg px-3 py-1">Best Price</span>
                </div>
              )}

              {/* Trust signals */}
              <div className="flex items-center gap-4 text-sm">
                {listing.average_rating && Number(listing.average_rating) > 0 ? (
                  <div className="flex items-center gap-1.5 bg-yellow-50 rounded-lg px-3 py-1.5">
                    <span className="font-bold text-gray-900">
                      {Number(listing.average_rating).toFixed(1)}
                    </span>
                    <span className="text-yellow-500">★</span>
                    {(listing.review_count ?? 0) > 0 && (
                      <span className="text-gray-600">({listing.review_count} reviews)</span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5">No reviews yet</span>
                )}
                
                <div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-3 py-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">Available</span>
                </div>
              </div>
            </div>

            {/* Description - Better Typography */}
            {listing.description && (
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Seller Profile - Enhanced Trust Display */}
            {listing.user_id && (
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      {listing.user && (
                        <p className="text-lg font-bold text-gray-900">{listing.user.name}</p>
                      )}
                      {sellerProfile?.business_name && (
                        <p className="text-sm text-gray-600 font-medium">{sellerProfile.business_name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Verified Seller</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={() => navigate(`/seller/${listing.user_id}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Call to Action Buttons - More Prominent */}
            {(whatsappLink || phoneLink) && (
              <div className="space-y-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Seller</h3>
                <div className="space-y-3">
                  {whatsappLink && <WhatsAppCTAButton whatsappLink={whatsappLink} />}
                  {phoneLink && <ContactCTAButton type="call" href={phoneLink} />}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  💡 Tip: Mention you found this on Shoogle for better response
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
              {listing.category && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <span className="text-base font-semibold text-gray-900">{listing.category}</span>
                </div>
              )}
              {listing.type && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <span className="text-base font-semibold text-gray-900">{listing.type}</span>
                </div>
              )}
              {listing.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Location</span>
                  <span className="text-base font-semibold text-gray-900">{listing.location}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {Array.isArray(listing.tags) && listing.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-5 text-xs text-gray-500">
              {listing.created_at && (
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(listing.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
              {listing.updated_at && (
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(listing.updated_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6">
          <ListingReviewsSection listingId={listing.id} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
