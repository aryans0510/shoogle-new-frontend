import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import type { Review } from "@/types/review";

// Helper function to truncate names smartly
const truncateName = (name: string | null | undefined): string => {
  if (!name) return "Anonymous";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  // Return first name + last initial, e.g., "Chirayu M."
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};

// Helper function to get initials for avatar
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface ReviewCardProps {
  review: Review;
  isReplying: boolean;
  replyValue: string;
  onReplyChange: (value: string) => void;
  onStartReply: () => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  onEditReply: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isReplying,
  replyValue,
  onReplyChange,
  onStartReply,
  onSubmitReply,
  onCancelReply,
  onEditReply,
}) => (
  <div className="group mb-4 w-full space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
    {/* Buyer Info with Avatar */}
    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
      {/* Avatar */}
      {review.buyer?.avatar_url ? (
        <img
          src={review.buyer.avatar_url}
          alt={`${truncateName(review.buyer?.full_name)} avatar`}
          className="h-10 w-10 flex-shrink-0 rounded-full border-2 border-gray-100 object-cover shadow-sm ring-2 ring-white"
        />
      ) : (
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-100 bg-gradient-to-br from-purple-500 to-purple-600 text-sm font-semibold text-white shadow-sm ring-2 ring-white">
          {getInitials(review.buyer?.full_name)}
        </div>
      )}
      <div className="flex-1">
        <p
          className="text-sm font-semibold text-gray-900"
          title={review.buyer?.full_name || "Anonymous"}
        >
          {truncateName(review.buyer?.full_name)}
        </p>
        <p className="text-xs text-gray-500">Customer</p>
      </div>
    </div>

    {/* Header with rating and date */}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {/* Star Rating Display */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 transition-colors ${i < review.rating ? "fill-yellow-400 stroke-yellow-400" : "fill-gray-200 stroke-gray-200"}`}
            />
          ))}
        </div>
        <span className="rounded-full bg-yellow-50 px-3 py-1 text-sm font-bold text-yellow-700 shadow-sm">
          {review.rating}.0
        </span>
      </div>
      <span className="text-xs font-medium text-gray-500">
        {new Date(review.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>

    {/* Comment */}
    {review.comment && (
      <div className="rounded-xl bg-gray-50 p-4">
        <p className="text-sm leading-relaxed text-gray-700">"{review.comment}"</p>
      </div>
    )}

    {/* Seller reply section */}
    {(review.review_reply || isReplying) && (
      <div className="space-y-3 border-t border-gray-100 pt-4">
        {/* Seller reply present */}
        {review.review_reply && !isReplying ? (
          <div className="space-y-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              <span className="text-sm font-semibold text-gray-900">Your Reply</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{review.review_reply.reply}</p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs font-medium text-blue-600 underline-offset-2 hover:underline"
              onClick={onEditReply}
            >
              Edit reply
            </Button>
          </div>
        ) : isReplying ? (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Write your reply</label>
            <Textarea
              value={replyValue}
              onChange={e => onReplyChange(e.target.value)}
              placeholder="Write your reply…"
              className="rounded-xl border-gray-200 bg-gray-50 transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!replyValue.trim()}
                onClick={onSubmitReply}
                className="rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Submit Reply
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="rounded-lg hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    )}

    {/* Reply button */}
    {!review.review_reply && !isReplying && (
      <div className="border-t border-gray-100 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onStartReply}
          className="rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
        >
          Reply to Review
        </Button>
      </div>
    )}
  </div>
);

export default ReviewCard;
