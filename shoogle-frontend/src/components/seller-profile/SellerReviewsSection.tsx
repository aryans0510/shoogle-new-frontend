import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import SellerReviewForm from "./SellerReviewForm";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/api";

const truncateName = (name: string | null | undefined): string => {
  if (!name) return "Anonymous";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

type SellerReview = {
  id: string;
  seller_id: string;
  reviewer_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  updated_at: string;
  reviewer?: {
    full_name?: string | null;
    avatar_url?: string | null;
  };
};
const SellerReviewsSection = ({ sellerId }: { sellerId: string }) => {
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);
  
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/seller-review/seller/${sellerId}`);
        if (response.data?.success && response.data?.data) {
          const reviewsData = response.data.data.map((r: any) => ({
            id: r.id,
            seller_id: r.seller_id,
            reviewer_id: r.reviewer_id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            updated_at: r.updated_at,
            reviewer: r.profiles_seller_reviews_reviewer_idToprofiles
              ? {
                  full_name: r.profiles_seller_reviews_reviewer_idToprofiles.user?.name || null,
                  avatar_url: r.profiles_seller_reviews_reviewer_idToprofiles.avatar_url || null,
                }
              : null,
          }));
          setReviews(reviewsData);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching seller reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [sellerId, refresh]);
  
  return (
    <div className="my-10">
      {user && user.id !== sellerId && (
        <div className="mb-8">
          <SellerReviewForm sellerId={sellerId} onSubmitted={() => setRefresh(x => x + 1)} />
        </div>
      )}
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
        <Star className="h-6 w-6 fill-yellow-400 stroke-yellow-400" />
        <h3 className="text-xl font-bold text-gray-900">Seller Reviews</h3>
        <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
          <span className="ml-3 text-sm text-gray-600">Loading reviews...</span>
        </div>
      )}
      {!loading && reviews.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
          <Star className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-base font-medium text-gray-600">No reviews yet</p>
          <p className="mt-2 text-sm text-gray-500">Be the first to share your experience!</p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {reviews.map(review => (
          <div
            key={review.id}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div className="mb-4 flex items-start gap-4">
              {review.reviewer?.avatar_url ? (
                <img
                  src={review.reviewer.avatar_url}
                  alt={`${truncateName(review.reviewer?.full_name)} avatar`}
                  className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-gray-100 object-cover shadow-sm ring-2 ring-white"
                />
              ) : (
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-100 bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-semibold text-white shadow-sm ring-2 ring-white">
                  {getInitials(review.reviewer?.full_name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className="truncate text-base font-semibold text-gray-900"
                    title={review.reviewer?.full_name || "Anonymous User"}
                  >
                    {truncateName(review.reviewer?.full_name)}
                  </h4>
                  <div className="flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 shadow-sm">
                    <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-sm font-bold text-yellow-700">{review.rating}.0</span>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            {review.comment && (
              <div className="mt-3 rounded-xl bg-gray-50 p-4">
                <p className="text-sm leading-relaxed text-gray-700">{review.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default SellerReviewsSection;