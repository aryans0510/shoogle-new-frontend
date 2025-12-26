import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import api from "@/api";

const categories = [
  "Electronics",
  "Appliances",
  "Services",
  "Clothing",
  "Toys",
  "Art",
  "Health",
  "Other",
];

const deliveryTypes = [
  { value: "pickup", label: "Local Pickup" },
  { value: "delivery", label: "Home Delivery (within area)" },
  { value: "both", label: "Both" },
];

interface Listing {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  price: number | null;
  tags?: string[];
  availability: "pickup" | "delivery" | "both";
  location?: string | null;
  media_urls?: string[];
}

interface EditListingDialogProps {
  listing: Listing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditListingDialog({
  listing,
  open,
  onOpenChange,
  onSuccess,
}: EditListingDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [delivery, setDelivery] = useState<"pickup" | "delivery" | "both">("both");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (listing) {
      setTitle(listing.title || "");
      setDescription(listing.description || "");
      setCategory(listing.category || "");
      setPrice(listing.price ? listing.price.toString() : "");
      setTags(listing.tags ? listing.tags.join(", ") : "");
      setDelivery(listing.availability || "both");
      setLocation(listing.location || "");
    }
  }, [listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    setSubmitting(true);
    try {
      const tagsArray = tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const updateData: any = {
        title: title.trim(),
        description: description.trim() || null,
        category: category,
        price: price ? parseFloat(price) : null,
        tags: tagsArray.length > 0 ? tagsArray : [],
        availability: delivery,
        location: location.trim() || null,
      };

      const response = await api.put(`/listing/${listing.id}`, updateData);

      if (response.data?.success) {
        toast.success("Listing updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(response.data?.message || "Failed to update listing");
      }
    } catch (error: any) {
      console.error("Error updating listing:", error);
      let errorMessage = "Failed to update listing";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errors = errorData.errors;
          if (typeof errors === "string") {
            errorMessage = errors;
          } else if (typeof errors === "object") {
            const errorMessages = Object.entries(errors)
              .map(([field, messages]: [string, any]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(", ")}`;
                }
                return `${field}: ${messages}`;
              })
              .join("; ");
            errorMessage = errorMessages || errorData.message || errorMessage;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Product/Service Name"
              required
              maxLength={80}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your product or service..."
              rows={4}
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={e => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                if (value === "" || parseFloat(value) >= 0) {
                  setPrice(value);
                }
              }}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability *</Label>
            <div className="space-y-2">
              {deliveryTypes.map(type => (
                <label key={type.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="availability"
                    value={type.value}
                    checked={delivery === type.value}
                    onChange={e => setDelivery(e.target.value as "pickup" | "delivery" | "both")}
                    className="h-4 w-4"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, Delhi"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !title.trim() || !category}>
              {submitting ? "Updating..." : "Update Listing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


