import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import api from "@/api";

const SellerReviewForm = ({
  sellerId,
  onSubmitted,
}: {
  sellerId: string;
  onSubmitted?: () => void;
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSubmitting(true);
    
    try {
      const response = await api.post("/seller-review/", {
        seller_id: sellerId,
        rating,
        comment: comment.trim() || null,
      });

      if (response.data?.success) {
      // Show success animation
      setShowSuccess(true);

      // Success animation/toast
      toast.success("Thank you for your feedback! 🎉", {
        description: "Your review has been submitted successfully.",
        duration: 3000,
      });

        setTimeout(() => {
          setShowSuccess(false);
          setRating(5);
          setComment("");
          if (onSubmitted) onSubmitted();
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

  return (
    <div className="mx-auto w-full max-w-2xl">
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
                      value <= (hoveredRating || rating) ? "scale-125 drop-shadow-md" : "scale-100"
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
          <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-gray-700">
            Your Review <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="review-comment"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
  );
};

export default SellerReviewForm;