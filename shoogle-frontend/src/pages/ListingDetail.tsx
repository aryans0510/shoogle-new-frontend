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
          {/* Media Gallery */}
          {Array.isArray(listing.media_urls) && listing.media_urls.length > 0 && (
            <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 sm:gap-3 sm:p-5">
              {listing.media_urls.map((url: string, i: number) => (
                <div key={i} className="overflow-hidden rounded-lg bg-gray-100">
                  {url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video src={url} className="h-64 w-full object-cover" controls />
                  ) : (
                    <img src={url} alt={"Media " + (i + 1)} className="h-64 w-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content Section */}
          <div className="space-y-6 p-5 sm:space-y-7 sm:p-7">
            {/* Title and Price */}
            <div className="space-y-3">
              <h1 className="text-3xl leading-tight font-bold text-gray-900 sm:text-4xl">
                {listing.title}
              </h1>

              {listing.price !== undefined && listing.price !== null && (
                <div className="text-3xl font-bold text-gray-900">{toINR(listing.price)}</div>
              )}
            </div>

            {/* Description */}
            {listing.description && (
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-base leading-relaxed text-gray-700">{listing.description}</p>
              </div>
            )}

            {/* Seller Profile Link */}
            {listing.user_id && (
              <div className="mb-4 rounded-xl border border-gray-200 bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    {listing.user && (
                      <p className="font-semibold text-gray-900">{listing.user.name}</p>
                    )}
                    {sellerProfile?.business_name && (
                      <p className="text-sm text-gray-600">{sellerProfile.business_name}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/seller/${listing.user_id}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Call to Action Buttons */}
            {(whatsappLink || phoneLink) && (
              <div className="space-y-3">
                {whatsappLink && <WhatsAppCTAButton whatsappLink={whatsappLink} />}
                {phoneLink && <ContactCTAButton type="call" href={phoneLink} />}
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
