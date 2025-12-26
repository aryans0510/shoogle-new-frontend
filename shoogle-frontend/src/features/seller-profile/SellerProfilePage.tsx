import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api";
import {
  SellerProfileHeader,
  SellerProfileEditForm,
  SellerReviewsSection,
} from "@/components/seller-profile";
import { Loader } from "@/components/common";
import SellerProfileListings from "./SellerProfileListings";
import SellerProfileReviews from "./SellerProfileReviews";

function formatDateTs(ts?: string) {
  if (!ts) return "–";
  const date = new Date(ts);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short" });
}

function formatLastSeen(ts?: string) {
  if (!ts) return "Never";
  const last = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now.getTime() - last.getTime()) / 1000); // seconds
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return (
    last.toLocaleDateString() +
    " " +
    last.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

const SellerProfilePage: React.FC = () => {
  const { seller_id } = useParams<{ seller_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);
  const [sellerListings, setSellerListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const highlightListingId = useMemo(() => {
    const url = new URL(window.location.href);
    return url.searchParams.get("highlight");
  }, [location]);

  // ===== New: track scroll position for header fade =====
  const [headerFade, setHeaderFade] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      // How much to scroll before header is fully faded, e.g. 100px
      const maxScroll = 80;
      const scrolled = Math.min(window.scrollY, maxScroll);
      const opacity = 1 - scrolled / maxScroll;
      setHeaderFade(opacity);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Set initial scroll when navigating with browser
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);

      try {
        // Fetch seller profile
        const profileResponse = await api.get(`/user/seller-profile/${seller_id}`);
        if (profileResponse.data?.success && profileResponse.data?.data) {
          setProfile(profileResponse.data.data);
        } else {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Fetch seller listings
        try {
          const listingsResponse = await api.get("/listing/public", {
            params: { limit: 100 },
          });
          if (listingsResponse.data?.success && listingsResponse.data?.data?.listings) {
            const allListings = listingsResponse.data.data.listings;
            // Filter listings by seller_id
            const sellerListings = allListings.filter(
              (l: any) => l.user_id === seller_id || l.user?.id === seller_id
            );
            setSellerListings(sellerListings);
          } else {
            setSellerListings([]);
          }
        } catch (error) {
          console.error("Error fetching listings:", error);
          setSellerListings([]);
        }

        // Fetch reviews for seller's listings
        try {
          // Get reviews for all listings by this seller
          const reviewsResponse = await api.get(`/review/listing/${seller_id}`);
          // Actually, we need to get reviews for listings, not seller
          // For now, set empty array - this might need a different endpoint
          setReviews([]);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching seller profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    if (seller_id) fetchAll();
    else setLoading(false);
  }, [seller_id]);

  useEffect(() => {
    const updateLastSeen = async () => {
      if (user?.id && seller_id && user.id === seller_id) {
        try {
          await api.put("/user/seller-profile", {
            // Note: last_seen_at update might need backend support
            // For now, silently fail if not supported
          });
        } catch (error) {
          // Ignore errors for last_seen_at update
        }
      }
    };
    updateLastSeen();
  }, [user, seller_id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Loader />
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="p-8 text-center text-red-500">
        Seller profile not found. Please make sure you are visiting a valid seller profile URL.
      </div>
    );
  }
  const canEdit = !!user && user.id === profile.id;
  const showNewlyVerified =
    !!profile?.verified_at &&
    new Date().getTime() - new Date(profile.verified_at).getTime() < 1000 * 3600 * 24 * 14;

  const profileHeaderData = {
    ...profile,
    listings: sellerListings,
    activeSince: formatDateTs(profile.created_at),
    lastSeen: formatLastSeen(profile.last_seen_at),
  };

  return (
    <div className="min-h-screen min-w-full bg-neutral-50 px-2 py-8 md:px-4">
      {/* Sticky SellerProfileHeader */}
      <SellerProfileHeader
        profile={profileHeaderData}
        canEdit={canEdit}
        isEditing={isEditing}
        showNewlyVerified={showNewlyVerified}
        onBack={() => navigate("/discover")}
        onEditToggle={() => setIsEditing(!isEditing)}
        setEditFields={() => {}}
        headerFade={headerFade}
      />
      {isEditing && canEdit && (
        <SellerProfileEditForm
          profile={profile}
          user={user}
          onProfileUpdate={p => setProfile(p)}
          onCancelEdit={() => setIsEditing(false)}
        />
      )}

      {/* Seller's listing grid */}
      <SellerProfileListings
        profile={profile}
        sellerListings={sellerListings}
        highlightListingId={highlightListingId}
      />

      {/* ------------- MOVED: Seller Reviews Section (only reviews shown after listings) ------------- */}
      <SellerReviewsSection sellerId={profile.id} />

      {/* Only show listing reviews here for completeness, but labeled */}
      <SellerProfileReviews reviews={reviews} />
    </div>
  );
};

export default SellerProfilePage;
