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
  CheckCircle,
  AlertCircle,
  Sparkles,
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

// --- Enhanced Floating input/textarea with validation states ---
const FloatingInput = React.memo(function FloatingInput({
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
  success,
  ...props
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  success?: boolean;
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
        className={`peer transition-all duration-200 ${
          showLabelAbove ? "pt-6 pb-2" : "py-3"
        } ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
            : success 
            ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
            : "focus:border-blue-500 focus:ring-blue-500/20"
        }`}
        placeholder={showLabelAbove ? "" : " "}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      <label
        htmlFor={stableId.current}
        className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          showLabelAbove
            ? `top-1.5 text-xs font-medium ${
                error ? "text-red-600" : success ? "text-green-600" : "text-blue-600"
              }`
            : "top-3 text-sm text-gray-500"
        }`}
      >
        {placeholder}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {success && (
        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
      )}
      {error && (
        <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
});

const FloatingTextarea = React.memo(function FloatingTextarea({
  value,
  onChange,
  placeholder,
  required = false,
  error,
  success,
  maxLength,
  ...props
}: {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder: string;
  required?: boolean;
  error?: string;
  success?: boolean;
  maxLength?: number;
  [x: string]: any;
}) {
  const stableId = React.useRef(useId());
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const showLabelAbove = focused || hasValue;
  const charCount = value.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.8;

  return (
    <div className="relative">
      <Textarea
        id={stableId.current}
        value={value}
        onChange={onChange}
        required={required}
        className={`peer resize-none transition-all duration-200 ${
          showLabelAbove ? "pt-7 pb-2" : "pt-3"
        } ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
            : success 
            ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
            : "focus:border-blue-500 focus:ring-blue-500/20"
        }`}
        rows={4}
        placeholder={showLabelAbove ? "" : " "}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        {...props}
      />
      <label
        htmlFor={stableId.current}
        className={`pointer-events-none absolute left-3 transition-all duration-200 ${
          showLabelAbove 
            ? `top-2 text-xs font-medium ${
                error ? "text-red-600" : success ? "text-green-600" : "text-blue-600"
              }`
            : "top-3 text-sm text-gray-500"
        }`}
      >
        {placeholder}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {success && (
        <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
      )}
      {error && (
        <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
      )}
      {maxLength && (
        <div className={`absolute bottom-2 right-3 text-xs ${
          isNearLimit ? "text-orange-500" : "text-gray-400"
        }`}>
          {charCount}/{maxLength}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
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
  const [category, setCategory] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [units, setUnits] = useState("");
  const [tags, setTags] = useState("");
  const [delivery, setDelivery] = useState("");
  const [whatsapp, setWhatsApp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Phone number validation helper
  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  // Real-time validation
  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = "Product name is required";
        } else if (value.length < 3) {
          newErrors.title = "Product name must be at least 3 characters";
        } else if (value.length > 80) {
          newErrors.title = "Product name must be less than 80 characters";
        } else {
          delete newErrors.title;
        }
        break;
      case 'category':
        if (!value || value.length === 0) {
          newErrors.category = "Please select at least one category";
        } else {
          delete newErrors.category;
        }
        break;
      case 'price':
        if (!value) {
          newErrors.price = "Price is required";
        } else if (parseFloat(value) <= 0) {
          newErrors.price = "Price must be greater than ₹0";
        } else {
          delete newErrors.price;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = "Description is required";
        } else if (value.length < 10) {
          newErrors.description = "Description must be at least 10 characters";
        } else {
          delete newErrors.description;
        }
        break;
      case 'units':
        if (!value) {
          newErrors.units = "Available units is required";
        } else if (parseInt(value) <= 0) {
          newErrors.units = "Must be at least 1 unit";
        } else {
          delete newErrors.units;
        }
        break;
      case 'whatsapp':
        if (!value) {
          newErrors.whatsapp = "WhatsApp number is required";
        } else if (!isValidPhone(value)) {
          newErrors.whatsapp = "Must be exactly 10 digits";
        } else {
          delete newErrors.whatsapp;
        }
        break;
      case 'mobileNumber':
        if (!value) {
          newErrors.mobileNumber = "Mobile number is required";
        } else if (!isValidPhone(value)) {
          newErrors.mobileNumber = "Must be exactly 10 digits";
        } else {
          delete newErrors.mobileNumber;
        }
        break;
      case 'delivery':
        if (!value) {
          newErrors.delivery = "Please select availability option";
        } else {
          delete newErrors.delivery;
        }
        break;
      case 'media':
        if (!value || value.length === 0) {
          newErrors.media = "Please upload at least one image";
        } else {
          delete newErrors.media;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // Calculate completion progress
  const getCompletionProgress = () => {
    const fields = [
      { key: 'title', value: title.trim() },
      { key: 'category', value: category.length > 0 },
      { key: 'price', value: price && parseFloat(price) > 0 },
      { key: 'description', value: description.trim() },
      { key: 'units', value: units && parseInt(units) > 0 },
      { key: 'whatsapp', value: whatsapp && isValidPhone(whatsapp) },
      { key: 'mobileNumber', value: mobileNumber && isValidPhone(mobileNumber) },
      { key: 'delivery', value: delivery },
      { key: 'media', value: media.length > 0 },
    ];
    
    const completed = fields.filter(field => field.value).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Enhanced validation
  const isValid = 
    title.trim().length >= 3 &&
    category.length > 0 &&
    price &&
    parseFloat(price) > 0 &&
    description.trim().length >= 10 &&
    units &&
    parseInt(units) > 0 &&
    delivery &&
    media.length > 0 &&
    isValidPhone(whatsapp) &&
    isValidPhone(mobileNumber) &&
    Object.keys(errors).length === 0;

  const progress = getCompletionProgress();

  useEffect(() => {
    // Validate fields on change
    validateField('title', title);
    validateField('category', category);
    validateField('price', price);
    validateField('description', description);
    validateField('units', units);
    validateField('whatsapp', whatsapp);
    validateField('mobileNumber', mobileNumber);
    validateField('delivery', delivery);
    validateField('media', media);
  }, [title, category, price, description, units, whatsapp, mobileNumber, delivery, media]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
      {/* Enhanced Fixed Header with Progress */}
      <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="shrink-0 hover:bg-gray-100"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">Create Listing</h1>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">{progress}% Complete</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Form Container */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="space-y-6">
          {/* Enhanced Basic Information Section */}
          <section className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Tell us about your product or service</p>
              </div>
            </div>
            <div className="space-y-6">
              <FloatingInput
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Product/Service Name"
                maxLength={80}
                required={true}
                error={errors.title}
                success={title.trim().length >= 3 && !errors.title}
              />
              
              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-700">
                  Categories <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs font-normal text-gray-500">(select multiple)</span>
                </label>
                {category.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    {category.map(cat => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-700 shadow-sm border border-blue-200"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => setCategory(category.filter(c => c !== cat))}
                          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-blue-100 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-gray-200 bg-white p-4">
                  {categories.map(cat => (
                    <label
                      key={cat}
                      className="flex cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-all hover:bg-blue-50 hover:border-blue-200 border border-transparent"
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
                {errors.category && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category}
                  </p>
                )}
              </div>
              
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
                error={errors.price}
                success={price && parseFloat(price) > 0 && !errors.price}
              />
            </div>
          </section>

          {/* Enhanced Media Section */}
          <section className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Media</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <span>High-quality images help buyers trust your listing. Use good lighting and show different angles.</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-gray-600">Add up to 3 high-quality images</p>
              </div>
              {media.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  {media.length} image{media.length > 1 ? 's' : ''} added
                </div>
              )}
            </div>
            <MediaUpload value={media} onChange={setMedia} />
            {errors.media && (
              <p className="mt-3 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.media}
              </p>
            )}
          </section>

          {/* Enhanced Details Section */}
          <section className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <AlignLeft className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Details</h2>
                <p className="text-sm text-gray-600">Provide comprehensive information about your offering</p>
              </div>
            </div>
            <div className="space-y-6">
              <FloatingTextarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write a clear, friendly description. Mention colors, features, or services included."
                maxLength={800}
                required={true}
                error={errors.description}
                success={description.trim().length >= 10 && !errors.description}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FloatingInput
                  type="number"
                  value={units}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value === "" || parseInt(value) > 0) {
                      setUnits(value);
                    }
                  }}
                  placeholder="Available Units/Slots"
                  min="1"
                  required={true}
                  error={errors.units}
                  success={units && parseInt(units) > 0 && !errors.units}
                />
                
                <FloatingInput
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder='Tags (e.g. "eco-friendly, vegan")'
                  required={false}
                />
              </div>
            </div>
          </section>

          {/* Enhanced Contact Info Section */}
          <section className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <span>
                        Required for buyers to contact you. This will be saved to your profile for future listings.
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-gray-600">How can buyers reach you?</p>
              </div>
            </div>
            
            <div className="mb-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Why do we need this?</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Buyers need a way to contact you about your listing. Your contact info will be saved for future listings.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FloatingInput
                value={mobileNumber}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobileNumber(value);
                }}
                placeholder="Mobile Number"
                required={true}
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                error={errors.mobileNumber}
                success={mobileNumber && isValidPhone(mobileNumber) && !errors.mobileNumber}
              />
              
              <FloatingInput
                value={whatsapp}
                onChange={e => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setWhatsApp(value);
                }}
                placeholder="WhatsApp Number"
                required={true}
                type="tel"
                pattern="[0-9]{10}"
                maxLength={10}
                error={errors.whatsapp}
                success={whatsapp && isValidPhone(whatsapp) && !errors.whatsapp}
              />
            </div>
          </section>

          {/* Enhanced Availability Section */}
          <section className="rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg">
                <Truck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Availability</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <span>How do you want to get the item/service to the buyer?</span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-gray-600">How will you deliver your product or service?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {deliveryTypes.map(opt => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 text-center transition-all hover:shadow-md ${
                    delivery === opt.value
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={delivery === opt.value}
                    onChange={e => setDelivery(e.target.value)}
                    className="h-5 w-5 accent-blue-600"
                    required
                  />
                  <div className="text-center">
                    <span className="block font-semibold text-gray-900">{opt.label}</span>
                    <span className="text-xs text-gray-600 mt-1">
                      {opt.value === 'pickup' && 'Buyers come to you'}
                      {opt.value === 'delivery' && 'You deliver to buyers'}
                      {opt.value === 'both' && 'Flexible options'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {errors.delivery && (
              <p className="mt-3 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.delivery}
              </p>
            )}
          </section>

          {/* Enhanced Submit Section */}
          <div className="sticky bottom-0 rounded-2xl border border-gray-200/60 bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
            <div className="space-y-4">
              {/* Validation Summary */}
              {Object.keys(errors).length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Please fix the following issues:</p>
                      <ul className="text-xs text-red-700 mt-2 space-y-1">
                        {Object.values(errors).map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Success Preview */}
              {isValid && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">
                      Great! Your listing is ready to be published.
                    </p>
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className={`w-full py-6 text-base font-semibold transition-all duration-300 ${
                  isValid 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl" 
                    : "bg-gray-400"
                }`}
                disabled={!isValid || submitting}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating your listing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Create Listing
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
              </Button>
              
              {whatsapp.trim() && isValidPhone(whatsapp) && (
                <div className="pt-4 border-t border-gray-200">
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
        </div>
      </form>
    </div>
  );
}
