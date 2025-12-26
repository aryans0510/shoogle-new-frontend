import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import api from "@/api";

interface ListingReactionButtonsProps {
  listingId: string;
  initialLikeCount?: number;
  initialDislikeCount?: number;
  showCounts?: boolean;
  size?: "sm" | "default";
}

const ListingReactionButtons: React.FC<ListingReactionButtonsProps> = ({
  listingId,
  initialLikeCount = 0,
  initialDislikeCount = 0,
  showCounts = true,
  size = "default",
}) => {
  const { user, isAuthenticated } = useAuth();
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [loading, setLoading] = useState(false);

  // Fetch user's current reaction
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserReaction();
    }
  }, [isAuthenticated, user, listingId]);

  const fetchUserReaction = async () => {
    try {
      const response = await api.get(`/reaction/listing/${listingId}`);
      if (response.data?.success && response.data?.data) {
        setUserReaction(response.data.data.reaction_type || null);
      } else {
        setUserReaction(null);
      }
    } catch (error) {
      console.error("Error fetching user reaction:", error);
      setUserReaction(null);
    }
  };

  const handleReaction = async (reactionType: "like" | "dislike") => {
    if (!isAuthenticated) {
      toast.error("Sign in required", {
        description: "Please sign in to react to listings.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/reaction/", {
        listing_id: listingId,
        reaction_type: reactionType,
      });

      if (response.data?.success) {
        // Update local state based on previous reaction
        if (userReaction === reactionType) {
          // Reaction was removed
          setUserReaction(null);
          if (reactionType === "like") {
            setLikeCount(prev => Math.max(0, prev - 1));
          } else {
            setDislikeCount(prev => Math.max(0, prev - 1));
          }
        } else {
          // Reaction was added or changed
          if (userReaction === "like" && reactionType === "dislike") {
            setLikeCount(prev => Math.max(0, prev - 1));
            setDislikeCount(prev => prev + 1);
          } else if (userReaction === "dislike" && reactionType === "like") {
            setDislikeCount(prev => Math.max(0, prev - 1));
            setLikeCount(prev => prev + 1);
          } else if (!userReaction) {
            if (reactionType === "like") {
              setLikeCount(prev => prev + 1);
            } else {
              setDislikeCount(prev => prev + 1);
            }
          }
          setUserReaction(reactionType);
        }
      } else {
        throw new Error(response.data?.message || "Failed to update reaction");
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Error", {
        description: "Failed to update reaction. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonSize = size === "sm" ? "sm" : "default";
  const iconSize = size === "sm" ? 16 : 20;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => handleReaction("like")}
        disabled={loading}
        className={`flex items-center gap-1 ${
          userReaction === "like"
            ? "border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100"
            : "hover:border-blue-300 hover:bg-blue-50"
        }`}
      >
        <ThumbsUp size={iconSize} />
        {showCounts && <span>{likeCount}</span>}
      </Button>
      <Button
        variant="outline"
        size={buttonSize}
        onClick={() => handleReaction("dislike")}
        disabled={loading}
        className={`flex items-center gap-1 ${
          userReaction === "dislike"
            ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
            : "hover:border-red-300 hover:bg-red-50"
        }`}
      >
        <ThumbsDown size={iconSize} />
        {showCounts && <span>{dislikeCount}</span>}
      </Button>
    </div>
  );
};

export default ListingReactionButtons;
