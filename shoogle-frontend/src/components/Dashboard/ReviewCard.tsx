import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Edit2, Trash2, MoreVertical } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Review } from "@/types/review";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import api from "@/api";

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
  onReviewUpdated?: () => void; // Callback when review is updated/deleted
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
  onReviewUpdated,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the review author
  const isReviewAuthor = user?.id === review.buyer_id;

  const handleEditReview = async () => {
    if (!editComment.trim() && editRating === review.rating) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await api.put(`/review/${review.id}`, {
        rating: editRating,
        comment: editComment.trim() || null,
      });

      if (response.data?.success) {
        toast.success("Review updated successfully!");
        setIsEditing(false);
        onReviewUpdated?.();
      } else {
        throw new Error(response.data?.message || "Failed to update review");
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to update review. Please try again.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await api.delete(`/review/${review.id}`);

      if (response.data?.success) {
        toast.success("Review deleted successfully!");
        onReviewUpdated?.();
      } else {
        throw new Error(response.data?.message || "Failed to delete review");
      }
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to delete review. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  return (
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
        {/* Star Rating Display or Edit */}
        {isEditing ? (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setEditRating(value)}
                className="transition-all duration-200 hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    value <= editRating
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "fill-gray-200 stroke-gray-200 hover:fill-yellow-200 hover:stroke-yellow-200"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">
          {new Date(review.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {/* Edit/Delete dropdown for review author */}
        {isReviewAuthor && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                disabled={isDeleting}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Review
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDeleteReview}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>

    {/* Comment */}
    {(review.comment || isEditing) && (
      <div className="rounded-xl bg-gray-50 p-4">
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Write your review (optional)..."
              className="rounded-xl border-gray-200 bg-white transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {editComment.length}/500 characters
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleEditReview}
                  disabled={isUpdating}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? "Updating..." : "Update Review"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={isUpdating}
                  className="rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-gray-700">"{review.comment}"</p>
        )}
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
    {!review.review_reply && !isReplying && !isEditing && (
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
};

export default ReviewCard;
