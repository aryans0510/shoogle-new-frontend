import React, { useEffect, useState } from "react";
import { Star, Edit2, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReviewCard from "@/components/Dashboard/ReviewCard";
import type { Review } from "@/types/review";
import { toast } from "@/components/ui/sonner";
import api from "@/api";

// Helper to get initials from a name
const getInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0] || "?";
  return parts[0][0] + (parts[1]?.[0] || "");
};

const MAX_COMMENT_PREVIEW = 230; // Chars, before showing "More"
const NEW_REVIEW_DAYS = 7;

const ListingReviewsSection = ({ listingId }: { listingId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [expanded, setExpanded] = useState<string | null>(null);

  // Review reply defaults - not implemented in Discover, but necessary for ReviewCard signature
  const [replyValue, setReplyValue] = useState("");
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      setFetchError(null);

      try {
        const response = await api.get(`/review/listing/${listingId}`);
        
        if (response.data?.success && response.data?.data) {
          const data = response.data.data;
          
          // Transform backend response to match Review type
          const formatted = data.map((row: any) => ({
            id: row.id,
            listing_id: row.listing_id,
            buyer_id: row.buyer_id,
            rating: row.rating,
            comment: row.comment || null,
            created_at: row.created_at,
            updated_at: row.updated_at,
            category: row.category || null,
            buyer: row.seller_profile?.user ? {
              full_name: row.seller_profile.user.name,
              avatar_url: row.seller_profile.avatar_url || null,
            } : null,
            review_reply: row.review_replies && row.review_replies.length > 0
              ? row.review_replies[0]
              : null,
          })) as Review[];
          
          setReviews(formatted);
        } else {
          setReviews([]);
        }
      } catch (error: any) {
        setFetchError("Error fetching reviews: " + (error.response?.data?.message || error.message));
        setReviews([]);
      } finally {
        setLoading(false);
      }
    }
    if (listingId) fetchReviews();
  }, [listingId, refresh]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    try {
      const response = await api.post("/review/", {
        listing_id: listingId,
        rating,
        comment: comment.trim() || null,
      });
      
      if (response.data?.success) {
        setShowSuccess(true);
        toast.success("Thank you for your feedback! 🎉", {
          description: "Your review has been submitted successfully.",
          duration: 3000,
        });

        setTimeout(() => {
          setShowSuccess(false);
          setRating(5);
          setComment("");
          setRefresh(x => x + 1);
        }, 1500);
      } else {
        throw new Error(response.data?.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isNew = (dateStr: string) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24);
    return diff < NEW_REVIEW_DAYS;
  };

  return (
    <div className="my-8 border-t px-1 pt-5 sm:my-10 sm:px-0 sm:pt-8">
      {/* Reviews Header */}
      <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
        <Star className="h-6 w-6 fill-yellow-400 stroke-yellow-400" />
        <h3 className="text-xl font-bold text-gray-900">Listing Reviews</h3>
        <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Review Form */}
      {user && (
        <div className="mb-8">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Success Animation Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-bounce">
                    <svg
                      className="h-20 w-20 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="animate-pulse text-xl font-semibold text-green-600">
                    Thanks for your review!
                  </p>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900">Share Your Experience</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your feedback helps others make better decisions
              </p>
            </div>

            {/* Rating Section */}
            <div className="mb-6 flex flex-col items-center">
              <label className="mb-3 text-sm font-medium text-gray-700">Rate your experience</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    type="button"
                    className="group relative transform transition-all duration-200 hover:scale-110 focus:outline-none"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                        value <= (hoveredRating || rating) ? "bg-yellow-50 shadow-md" : "bg-gray-50"
                      }`}
                    >
                      <Star
                        className={`h-7 w-7 transition-all duration-200 ${
                          value <= (hoveredRating || rating)
                            ? "scale-125 drop-shadow-md"
                            : "scale-100"
                        }`}
                        fill={value <= (hoveredRating || rating) ? "#FBBF24" : "none"}
                        stroke={value <= (hoveredRating || rating) ? "#FBBF24" : "#D1D5DB"}
                        strokeWidth={2}
                        style={{
                          filter:
                            value <= (hoveredRating || rating)
                              ? "drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))"
                              : "none",
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Great!"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            </div>

            {/* Comment Section */}
            <div className="mb-6">
              <label
                htmlFor="listing-review-comment"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your Review <span className="text-gray-400">(optional)</span>
              </label>
              <Textarea
                id="listing-review-comment"
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                rows={4}
                maxLength={500}
                placeholder="Write your review (optional)..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={submitting}
              />
              <div className="mt-1 text-right text-xs text-gray-400">
                {comment.length}/500 characters
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={submitting}
                className="group relative h-12 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 text-base font-medium text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Review
                    <svg
                      className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {fetchError && <div className="mb-3 text-red-500">{fetchError}</div>}

      {loading && <div className="text-muted-foreground">Loading reviews…</div>}

      {!loading && reviews.length === 0 && !fetchError && (
        <div className="mt-2 mb-6 text-base text-neutral-500">
          No reviews for this listing yet. Be the first to review!
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="flex flex-col gap-4 sm:gap-5">
          {reviews.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              isReplying={false}
              replyValue=""
              onReplyChange={() => {}}
              onStartReply={() => {}}
              onSubmitReply={() => {}}
              onCancelReply={() => {}}
              onEditReply={() => {}}
              onReviewUpdated={() => setRefresh(x => x + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListingReviewsSection;
