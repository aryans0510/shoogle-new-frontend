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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">My Listings</h2>
        {listings?.length > 0 && (
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Active</div>
            <div className="text-2xl font-bold text-primary">{listings.length}</div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your listings...</p>
        </div>
      ) : !listings?.length ? (
        <div className="py-12 text-center bg-muted/30 rounded-lg border border-dashed border-muted">
          <div className="text-5xl mb-4 opacity-60">📦</div>
          <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Create your first listing to start connecting with customers
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard/create-listing'}
            className="font-semibold"
          >
            Create First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, index) => (
            <Card key={listing.id} className="w-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="line-clamp-2 text-lg font-semibold leading-tight">
                    {listing.title}
                  </CardTitle>
                  {index < 3 && (
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium shrink-0">
                      TOP
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Metadata Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-muted px-3 py-1.5 rounded text-xs font-medium text-muted-foreground">
                    {listing.category}
                  </span>
                  {typeof ratings?.[listing.id] === "number" && (
                    <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-yellow-500" fill="#facc15" />
                      <span className="text-sm font-semibold">
                        {ratings[listing.id].toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price Display */}
                {listing.price !== null && (
                  <div className="text-xl font-bold text-primary">₹{listing.price.toLocaleString()}</div>
                )}

                {/* Description Preview */}
                {listing.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>
                )}

                {/* Improved Action Buttons Layout */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 font-medium"
                    onClick={() => setActiveListingId(listing.id)}
                  >
                    Reviews
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditListing(listing)}
                      className="h-9 w-9 p-0"
                      title="Edit Listing"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(listing.id)}
                      className="h-9 w-9 p-0"
                      title="Share Listing"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <AlertDialog
                      open={deleteDialogId === listing.id}
                      onOpenChange={open => setDeleteDialogId(open ? listing.id : null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
