import React, { useId, useState, useEffect } from "react";
import {
  Info,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  AlignLeft,
  Phone,
  Truck,
  Package,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaUpload } from "@/components/CreateListing";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
import { WhatsAppCTAButton } from "@/components/common";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import api from "@/api";

// --- Floating input/textarea outside component for id stability ---
const FloatingInput = React.memo(function FloatingInput({
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  ...props
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder: string;
  required?: boolean;
  [x: string]: any;
}) {
  const stableId = React.useRef(useId());
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const showLabelAbove = focused || hasValue;

  return (
    <div className="relative">
      <Input
        id={stableId.current}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`peer ${showLabelAbove ? "pt-6 pb-2" : "py-3"} transition-all`}
        placeholder={showLabelAbove ? "" : " "}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      <label
        htmlFor={stableId.current}
        className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          showLabelAbove
            ? "top-1.5 text-xs font-medium text-blue-600"
            : "top-3 text-sm text-gray-500"
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
});

const FloatingTextarea = React.memo(function FloatingTextarea({
  value,
  onChange,
  placeholder,
  required = false,
  ...props
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder: string;
  required?: boolean;
  [x: string]: any;
}) {
  const stableId = React.useRef(useId());
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const showLabelAbove = focused || hasValue;

  return (
    <div className="relative">
      <Textarea
        id={stableId.current}
        value={value}
        onChange={onChange}
        required={required}
        className={`peer resize-none ${showLabelAbove ? "pt-7 pb-2" : "pt-3"} transition-all`}
        rows={4}
        placeholder={showLabelAbove ? "" : " "}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      <label
        htmlFor={stableId.current}
        className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          showLabelAbove ? "top-2 text-xs font-medium text-blue-600" : "top-3 text-sm text-gray-500"
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
});
// ---------------------

/**
 * Instagram-inspired Create Listing Screen
 */
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

export default function DashboardCreateListing() {
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string[]>([]); // Changed to array for multiple categories
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState("");
  const [tags, setTags] = useState("");
  const [delivery, setDelivery] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [mobileNumber, setMobileNumber] = useState(""); // <-- NEW STATE
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Phone number validation helper
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  // Validation - now includes required contact info with phone validation
  const isValid =
    title.trim().length > 0 &&
    category.length > 0 && // Changed to check array length
    price &&
    parseFloat(price) > 0 &&
    description.trim().length > 0 &&
    units &&
    parseInt(units) > 0 &&
    delivery &&
    media.length > 0 &&
    isValidPhone(whatsapp) &&
    isValidPhone(mobileNumber);

  useEffect(() => {
    // console.log("isValid", isValid);
  }, [isValid]);

  // Convert tags string to array
  const tagsArray = tags
    .split(",")
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || !user?.id) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload media files to S3 via backend API
      const mediaUrls: string[] = [];
      
      for (let i = 0; i < media.length; i++) {
        const mediaItem = media[i];
        if (mediaItem.file) {
          try {
            const fileExt = mediaItem.file.name.split(".").pop()?.toLowerCase() || "jpg";
            
            // Map file extension to supported type
            const typeMap: Record<string, string> = {
              jpg: "jpg",
              jpeg: "jpeg",
              png: "png",
              gif: "gif",
              webp: "webp",
            };
            const imageType = typeMap[fileExt] || "jpg";
            
            // Get signed URL from backend
            const urlResponse = await api.post("/listing/generate-bucket-url", {
              type: imageType,
            });
            
            if (!urlResponse.data?.data) {
              toast.error(`Failed to get upload URL for image ${i + 1}`);
              setSubmitting(false);
              return;
            }
            
            const signedUrl = urlResponse.data.data;
            
            // Extract the S3 key from the signed URL to construct public URL
            // Signed URL format: https://bucket.s3.region.amazonaws.com/key?signature
            const urlObj = new URL(signedUrl);
            const s3Key = urlObj.pathname.substring(1); // Remove leading slash
            
            // Upload file directly to S3 using signed URL
            const uploadResponse = await fetch(signedUrl, {
              method: "PUT",
              body: mediaItem.file,
              headers: {
                "Content-Type": `image/${imageType === "jpg" ? "jpeg" : imageType}`,
              },
            });
            
            if (!uploadResponse.ok) {
              throw new Error(`Upload failed with status ${uploadResponse.status}`);
            }
            
            // Construct public S3 URL (assuming bucket allows public read access)
            // Format: https://bucket.s3.region.amazonaws.com/key
            const publicUrl = `https://shoogle-user-listings.s3.ap-south-1.amazonaws.com/${s3Key}`;
            mediaUrls.push(publicUrl);
          } catch (uploadException: any) {
            console.error("Exception during upload:", uploadException);
            // Handle network errors and other exceptions
            if (uploadException.message?.includes("Failed to fetch") || uploadException.message?.includes("NetworkError") || uploadException.name === "TypeError") {
              toast.error(`Failed to upload image ${i + 1}: Network error. Please check your internet connection.`);
            } else if (uploadException.response?.data?.message) {
              toast.error(`Failed to upload image ${i + 1}: ${uploadException.response.data.message}`);
            } else {
              toast.error(`Failed to upload image ${i + 1}: ${uploadException.message || "Unknown error"}`);
            }
            setSubmitting(false);
            return;
          }
        }
      }

      if (mediaUrls.length === 0) {
        toast.error("Please upload at least one image");
        setSubmitting(false);
        return;
      }

      // 2. Update seller profile with contact information
      try {
        await api.put("/user/seller-profile", {
          whatsapp_number: whatsapp.replace(/\D/g, ""),
        });
      } catch (profileError: any) {
        console.error("Error updating profile:", profileError);
        // Don't fail the listing creation if profile update fails
        toast.error("Warning: Contact info not saved, but listing will be created");
      }

      // 3. Create the listing
      // Use first category for now (database expects single category string)
      const primaryCategory = category.length > 0 ? category[0] : "Other";
      
      try {
        // Ensure availability matches backend enum values
        const availabilityMap: Record<string, "pickup" | "delivery" | "both"> = {
          pickup: "pickup",
          delivery: "delivery",
          both: "both",
        };
        
        const mappedAvailability = availabilityMap[delivery] || "both";
        
        // Prepare description - backend expects string or undefined, not empty string
        const listingDescription = description.trim() || undefined;
        
        // Ensure price is a number or null (not 0 or NaN)
        const listingPrice = price && parseFloat(price) > 0 ? parseFloat(price) : null;
        
        // Validate category is one of the allowed values
        const validCategories = ["Electronics", "Appliances", "Services", "Clothing", "Toys", "Art", "Health", "Other"];
        const finalCategory = validCategories.includes(primaryCategory) ? primaryCategory : "Other";
        
        // Ensure media_urls is an array
        const finalMediaUrls = Array.isArray(mediaUrls) && mediaUrls.length > 0 ? mediaUrls : [];
        
        console.log("Creating listing with data:", {
          title: title.trim(),
          description: listingDescription,
          category: finalCategory,
          price: listingPrice,
          media_urls: finalMediaUrls,
          tags: tagsArray,
          availability: mappedAvailability,
          location: null,
        });
        
        const listingResponse = await api.post("/listing/create", {
          title: title.trim(),
          description: listingDescription,
          category: finalCategory,
          price: listingPrice,
          media_urls: finalMediaUrls,
          tags: tagsArray.length > 0 ? tagsArray : [],
          availability: mappedAvailability,
          location: null,
        });

        if (!listingResponse.data?.success) {
          throw new Error(listingResponse.data?.message || "Failed to create listing");
        }
      } catch (listingError: any) {
        console.error("Error creating listing:", listingError);
        let errorMessage = "Failed to create listing";
        
        if (listingError.response?.data) {
          const errorData = listingError.response.data;
          // Show validation errors if available
          if (errorData.errors) {
            const errors = errorData.errors;
            if (typeof errors === "string") {
              errorMessage = errors;
            } else if (Array.isArray(errors)) {
              errorMessage = errors.join(", ");
            } else if (typeof errors === "object") {
              // Format zod validation errors
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
        } else if (listingError.message) {
          errorMessage = listingError.message;
        }
        
        toast.error(`Failed to create listing: ${errorMessage}`);
        setSubmitting(false);
        return;
      }

      // Success!
      toast.success("Listing created successfully!", {
        description: "Your listing is now live. Share it to get reviews!",
      });

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="shrink-0"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Create Listing</h1>
        </div>
      </div>

      {/* Main Form Container - No scrolling feel */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="space-y-8">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <FileText className="h-5 w-5 text-blue-600" />
              Basic Information
            </div>
            <div className="space-y-4">
              <FloatingInput
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Product/Service Name"
                maxLength={80}
                required={true}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Categories (select multiple)
                </label>
                <div className="space-y-2">
                  {category.length > 0 && (
                    <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      {category.map(cat => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 py-1 text-sm font-medium text-blue-700"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => setCategory(category.filter(c => c !== cat))}
                            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-blue-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Category checkboxes */}
                  <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white p-3">
                    {categories.map(cat => (
                      <label
                        key={cat}
                        className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={category.includes(cat)}
                          onChange={e => {
                            if (e.target.checked) {
                              setCategory([...category, cat]);
                            } else {
                              setCategory(category.filter(c => c !== cat));
                            }
                          }}
                          className="h-4 w-4 rounded accent-blue-600"
                        />
                        <span className="font-medium text-gray-700">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <FloatingInput
                  type="number"
                  value={price}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    if (value === "" || parseFloat(value) >= 0) {
                      setPrice(value);
                    }
                  }}
                  placeholder="Price (₹)"
                  min="0.01"
                  step="any"
                  required={true}
                />
                {price && parseFloat(price) <= 0 && (
                  <p className="mt-1 text-xs text-red-600">Price must be greater than ₹0</p>
                )}
              </div>
            </div>
          </section>

          {/* MEDIA */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Media
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <span>Add up to 3 images for your listing.</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <MediaUpload value={media} onChange={setMedia} />
          </section>

          {/* DETAILS */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <AlignLeft className="h-5 w-5 text-blue-600" />
              Details
            </div>
            <div className="space-y-4">
              <FloatingTextarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write a clear, friendly description. Mention colors, features, or services included."
                maxLength={800}
                required={true}
                className="py-[38px]"
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Available Units/Slots
                </label>
                <FloatingInput
                  type="number"
                  value={units}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value === "" || parseInt(value) > 0) {
                      setUnits(value);
                    }
                  }}
                  placeholder="e.g. 12"
                  min="1"
                  required={true}
                />
                {units && parseInt(units) <= 0 && (
                  <p className="mt-1 text-xs text-red-600">Must be at least 1 unit</p>
                )}
              </div>
              <FloatingInput
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder='Tags (optional, e.g. "eco-friendly, vegan")'
                required={false}
              />
            </div>
          </section>

          {/* CONTACT INFO */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Phone className="h-5 w-5 text-blue-600" />
              Contact Information
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <span>
                    Required for buyers to contact you. This will be saved to your profile.
                  </span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                Contact information is required. Buyers need a way to reach you!
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <FloatingInput
                  value={mobileNumber}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobileNumber(value);
                  }}
                  placeholder="Mobile Number (required)"
                  required={true}
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
                {mobileNumber && !isValidPhone(mobileNumber) && (
                  <p className="mt-1 text-xs text-red-600">Must be exactly 10 digits</p>
                )}
              </div>
              <div>
                <FloatingInput
                  value={whatsapp}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setWhatsApp(value);
                  }}
                  placeholder="WhatsApp Number (required)"
                  required={true}
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
                {whatsapp && !isValidPhone(whatsapp) && (
                  <p className="mt-1 text-xs text-red-600">Must be exactly 10 digits</p>
                )}
              </div>
            </div>
          </section>

          {/* AVAILABILITY */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Truck className="h-5 w-5 text-blue-600" />
              Availability
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <span>How do you want to get the item/service to the buyer?</span>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-3">
              {deliveryTypes.map(opt => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={delivery === opt.value}
                    onChange={e => setDelivery(e.target.value)}
                    className="h-4 w-4 accent-blue-600"
                    required
                  />
                  <span className="font-medium text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="sticky bottom-0 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <Button
              type="submit"
              className="w-full py-6 text-base font-semibold"
              disabled={!isValid || submitting}
            >
              <Package className="mr-2 h-5 w-5" />
              {submitting ? "Creating..." : "Create Listing"}
            </Button>
            {whatsapp.trim() && (
              <div className="mt-4">
                <WhatsAppCTAButton
                  whatsappLink={
                    whatsapp.startsWith("http")
                      ? whatsapp
                      : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
                  }
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
