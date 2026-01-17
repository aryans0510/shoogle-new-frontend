import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import ReviewCard from "./ReviewCard";
import { Loader } from "@/components/common";
import api from "@/api";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  buyer_id: string;
  created_at: string;
  review_reply?: {
    id: string;
    reply: string;
    seller_id: string;
    created_at: string;
  } | null;
}

interface ListingReviewsDrawerProps {
  listingId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ListingReviewsDrawer: React.FC<ListingReviewsDrawerProps> = ({
  listingId,
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [replyValue, setReplyValue] = useState("");
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);

  // Fetch reviews for this listing (with possible reply for each)
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["listing-reviews", listingId],
    queryFn: async () => {
      if (!listingId) return [];
      const response = await api.get(`/review/listing/${listingId}`);
      if (response.data?.success && response.data?.data) {
        return response.data.data.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          buyer_id: r.buyer_id,
          created_at: r.created_at,
          review_reply: r.review_replies && r.review_replies.length > 0 ? r.review_replies[0] : null,
        }));
      }
      return [];
    },
    enabled: !!listingId,
  });

  // Seller reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ reviewId, reply }: { reviewId: string; reply: string }) => {
      if (!user?.id) throw new Error("Must be logged in as seller to reply.");
      
      // Check if reply exists
      try {
        const existingResponse = await api.get(`/review/listing/${listingId}`);
        const existingReviews = existingResponse.data?.data || [];
        const review = existingReviews.find((r: any) => r.id === reviewId);
        const existingReply = review?.review_replies?.[0];
        
        if (existingReply) {
          // Update existing reply
          const response = await api.put(`/review/reply/${existingReply.id}`, { reply });
          if (!response.data?.success) throw new Error("Failed to update reply");
        } else {
          // Create new reply
          const response = await api.post("/review/reply", { review_id: reviewId, reply });
          if (!response.data?.success) throw new Error("Failed to create reply");
        }
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to save reply");
      }
    },
    onSuccess: () => {
      toast.success("Reply submitted!", {
        description: "Your response is now public on this review.",
      });
      setReplyValue("");
      setReplyingReviewId(null);
      queryClient.invalidateQueries({ queryKey: ["listing-reviews", listingId] });
    },
    onError: (error: any) => {
      toast.error("Could not submit reply", {
        description: error?.message || "Failed to respond to review.",
      });
    },
  });

  const handleReply = (reviewId: string) => {
    replyMutation.mutate({ reviewId, reply: replyValue });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed top-0 right-0 z-50 flex h-full w-full flex-col border-l bg-background sm:w-[500px]">
        <DrawerClose asChild>
          <button className="absolute top-3 right-3 rounded p-2 text-muted-foreground hover:bg-muted">
            ×
          </button>
        </DrawerClose>
        <div className="flex-1 overflow-y-auto px-2 py-6 sm:px-6">
          <h3 className="mb-4 text-xl font-bold">Reviews</h3>
          {isLoading ? (
            <div>
              <Loader />
            </div>
          ) : !reviews?.length ? (
            <div className="text-muted-foreground">No reviews for this listing yet.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  isReplying={replyingReviewId === review.id}
                  replyValue={replyingReviewId === review.id ? replyValue : ""}
                  onReplyChange={setReplyValue}
                  onStartReply={() => {
                    setReplyingReviewId(review.id);
                    setReplyValue("");
                  }}
                  onEditReply={() => {
                    setReplyingReviewId(review.id);
                    setReplyValue(review.review_reply?.reply || "");
                  }}
                  onSubmitReply={() => handleReply(review.id)}
                  onCancelReply={() => {
                    setReplyValue("");
                    setReplyingReviewId(null);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ListingReviewsDrawer;
