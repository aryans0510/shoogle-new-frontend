import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Copy, Trash2, Pencil } from "lucide-react";
import ListingReviewsDrawer from "./ListingReviewsDrawer";
import EditListingDialog from "./EditListingDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import api from "@/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  title: string;
  price: number | null;
  category: string;
  description?: string | null;
  tags?: string[];
  availability: "pickup" | "delivery" | "both";
  location?: string | null;
  media_urls?: string[];
}

const SellerListings: React.FC = () => {
  const { user } = useAuth();
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const [editListing, setEditListing] = useState<Listing | null>(null);

  const {
    data: listings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await api.get("/listing/");
      if (response.data?.success && response.data?.data) {
        return response.data.data.map((l: any) => ({
          id: l.id,
          title: l.title,
          price: l.price ? parseFloat(l.price.toString()) : null,
          category: l.category,
          description: l.description,
          tags: l.tags || [],
          availability: l.availability || "both",
          location: l.location,
          media_urls: l.media_urls || [],
        })) as Listing[];
      }
      return [];
    },
    enabled: !!user?.id,
  });

  // Average rating per listing
  const { data: ratings } = useQuery({
    queryKey: ["my-listings-ratings", listings],
    queryFn: async () => {
      if (!listings || listings.length === 0) return {};
      const map: Record<string, number[]> = {};
      
      // Fetch reviews for each listing
      for (const listing of listings) {
        try {
          const response = await api.get(`/review/listing/${listing.id}`);
          if (response.data?.success && response.data?.data) {
            const reviews = response.data.data as Array<{ rating: number }>;
            if (reviews.length > 0) {
              map[listing.id] = reviews.map(r => r.rating);
            }
          }
        } catch (error) {
          // Ignore errors for individual listings
        }
      }
      
      return Object.fromEntries(
        Object.entries(map).map(([lid, ratings]) => [
          lid,
          ratings.reduce((a, b) => a + b, 0) / ratings.length,
        ]),
      );
    },
    enabled: !!listings && listings.length > 0,
  });

  const handleShare = (listingId: string) => {
    const baseUrl = window.location.origin + "/listing/" + listingId + "?shared=1";
    navigator.clipboard.writeText(baseUrl);
    toast.success("Link copied!", {
      description: "Share this private link to invite reviews and unlock Discovery.",
    });
  };

  const handleDelete = async (listingId: string) => {
    try {
      const response = await api.delete(`/listing/${listingId}`);
      if (response.data?.success) {
        toast.success("Listing deleted", {
          description: "The listing has been removed.",
        });
        refetch(); // refresh listings
      } else {
        throw new Error(response.data?.message || "Failed to delete listing");
      }
    } catch (error: any) {
      toast.error("Failed to delete.", {
        description: error.response?.data?.message || error.message || "Unknown error",
      });
    }
    setDeleteDialogId(null);
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 text-xl font-bold sm:text-2xl">My Listings</h2>
      {isLoading ? (
        <div className="py-8 text-center">Loading your listings...</div>
      ) : !listings?.length ? (
        <div className="py-8 text-center text-muted-foreground">You have no listings yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map(listing => (
            <Card key={listing.id} className="w-full">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-base sm:text-lg">{listing.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                    #{listing.category}
                  </span>
                  {typeof ratings?.[listing.id] === "number" && (
                    <span className="flex items-center gap-0.5">
                      <Star className="h-4 w-4 text-yellow-500" fill="#facc15" />
                      <span className="text-sm font-semibold">
                        {ratings[listing.id].toFixed(1)}
                      </span>
                    </span>
                  )}
                </div>
                {listing.price !== null && (
                  <div className="font-semibold text-primary">₹{listing.price}</div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-w-0 flex-1"
                    onClick={() => setActiveListingId(listing.id)}
                  >
                    Reviews
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditListing(listing)}
                    title="Edit Listing"
                    aria-label="Edit Listing"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(listing.id)}
                    title="Share this Listing"
                    aria-label="Share this Listing"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <AlertDialog
                    open={deleteDialogId === listing.id}
                    onOpenChange={open => setDeleteDialogId(open ? listing.id : null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label="Delete Listing"
                        onClick={() => setDeleteDialogId(listing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <b>{listing.title}</b>? This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(listing.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ListingReviewsDrawer
        listingId={activeListingId}
        open={!!activeListingId}
        onOpenChange={open => !open && setActiveListingId(null)}
      />
      <EditListingDialog
        listing={editListing}
        open={!!editListing}
        onOpenChange={open => !open && setEditListing(null)}
        onSuccess={() => {
          refetch();
          setEditListing(null);
        }}
      />
    </div>
  );
};

export default SellerListings;
