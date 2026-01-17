import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/api";

const AVAILABLE_CATEGORIES = [
  "Bakery",
  "Catering",
  "Florist",
  "Photography",
  "Event Planning",
  "Venue",
  "Decor",
  "Music",
  "Lighting",
  "Transportation",
  "Other",
];

interface SellerProfileEditFormProps {
  profile: any;
  user: any;
  onProfileUpdate: (p: any) => void;
  onCancelEdit: () => void;
}

const SellerProfileEditForm: React.FC<SellerProfileEditFormProps> = ({
  profile,
  user,
  onProfileUpdate,
  onCancelEdit,
}) => {
  const [brandName, setBrandName] = useState(profile.brand_name || profile.business_name || "");
  const [fullName, setFullName] = useState(profile.full_name || profile.name || user.name || "");
  const [categories, setCategories] = useState<string[]>(profile.categories || []);
  const [address, setAddress] = useState(profile.address || "");
  const [businessHours, setBusinessHours] = useState(profile.business_hours || "");
  const [email, setEmail] = useState(profile.email || user.email || "");
  const [website, setWebsite] = useState(profile.website || "");
  const [editWhatsApp, setEditWhatsApp] = useState(profile.whatsapp || profile.whatsapp_number || "");
  const [editDescription, setEditDescription] = useState(profile.description || "");
  const [editInstagram, setEditInstagram] = useState(profile.instagram || "");
  const [editFacebook, setEditFacebook] = useState(profile.facebook || "");
  const [editLocation, setEditLocation] = useState(profile.location || "");
  const [editMobileNumber, setEditMobileNumber] = useState(profile.phone || profile.user?.phone || user.phone || "");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleCategoryToggle = (category: string) => {
    setCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setEditError(null);

    if (!brandName.trim()) {
      setEditError("Brand Name cannot be empty.");
      setSaving(false);
      return;
    }
    if (!fullName.trim()) {
      setEditError("Full Name cannot be empty.");
      setSaving(false);
      return;
    }

    try {
      // Send WhatsApp number as-is (backend will handle formatting and validation)
      const formattedWhatsApp = editWhatsApp.trim() || null;

      const response = await api.put("/user/seller-profile", {
        brand_name: brandName.trim(),
        full_name: fullName.trim(),
        email: email.trim() || null,
        description: editDescription.trim() || null,
        categories: categories.length ? categories : null,
        address: address.trim() || null,
        business_hours: businessHours.trim() || null,
        website: website.trim() || null,
        whatsapp_number: formattedWhatsApp,
        instagram: editInstagram.trim() || null,
        facebook: editFacebook.trim() || null,
        location: editLocation.trim() || null,
        phone: editMobileNumber.trim() || null,
      });
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to update profile");
      }
      // Update profile with response data
      if (response.data?.data) {
        onProfileUpdate(response.data.data);
      } else {
        onProfileUpdate({
          ...profile,
          brand_name: brandName.trim(),
          full_name: fullName.trim(),
          email: email.trim(),
          categories: categories.length ? categories : null,
          address: address.trim(),
          business_hours: businessHours.trim(),
          website: website.trim(),
          whatsapp_number: formattedWhatsApp,
          description: editDescription.trim(),
          instagram: editInstagram.trim(),
          facebook: editFacebook.trim(),
          location: editLocation.trim(),
          phone: editMobileNumber.trim() || null,
          user: {
            ...profile.user,
            phone: editMobileNumber.trim() || null,
          },
        });
      }
      onCancelEdit();
    } catch (err: any) {
      // Extract error message from axios error response
      let errorMessage = "Network Error";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        if (typeof errors === "string") {
          errorMessage = errors;
        } else if (Array.isArray(errors)) {
          errorMessage = errors.join(", ");
        } else if (typeof errors === "object") {
          errorMessage = Object.values(errors).flat().join(", ");
        }
      } else if (err.message) {
        errorMessage = err.message;
      } else if (err.code === "ERR_NETWORK" || err.code === "ECONNABORTED") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      setEditError("Failed to update profile. " + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="mb-8 mt-4 flex flex-col gap-4 rounded-lg border bg-white p-4 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Brand Name <span className="text-rose-500">*</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="text"
          value={brandName}
          maxLength={64}
          autoFocus
          required
          onChange={e => setBrandName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="text"
          value={fullName}
          maxLength={64}
          required
          onChange={e => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Categories <span className="text-gray-400">(select all that apply)</span>
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {AVAILABLE_CATEGORIES.map(cat => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-1 rounded bg-blue-50 px-2 py-1"
            >
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="accent-blue-500"
              />
              <span className="text-xs">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">Address</label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          maxLength={128}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">Business Hours</label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="text"
          value={businessHours}
          onChange={e => setBusinessHours(e.target.value)}
          maxLength={64}
          placeholder="e.g. Mon-Fri 9am-6pm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Email <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          maxLength={128}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Website <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="url"
          placeholder="https://yourbrand.com"
          value={website}
          onChange={e => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Description / About your business
        </label>
        <textarea
          className="min-h-[64px] w-full rounded border bg-gray-50 px-3 py-2 text-base"
          placeholder="Tell buyers about your business..."
          value={editDescription}
          maxLength={500}
          onChange={e => setEditDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          WhatsApp Short Link or Number <span className="text-gray-400">(for CTA button)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="text"
          placeholder="e.g. https://wa.me/919999999999 or just 919999999999"
          value={editWhatsApp}
          onChange={e => setEditWhatsApp(e.target.value)}
          maxLength={64}
        />
        <span className="text-xs text-gray-500">
          Buyers will see a WhatsApp button on your profile.
        </span>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Instagram Profile Link <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="url"
          placeholder="https://instagram.com/yourbrand"
          value={editInstagram}
          onChange={e => setEditInstagram(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Facebook Profile Link <span className="text-gray-400">(optional)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="url"
          placeholder="https://facebook.com/yourbrand"
          value={editFacebook}
          onChange={e => setEditFacebook(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Location <span className="text-gray-400">(e.g. Mumbai, Delhi, etc)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="text"
          placeholder="e.g. Mumbai, Delhi, Bangalore"
          value={editLocation}
          onChange={e => setEditLocation(e.target.value)}
          maxLength={128}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold">
          Mobile Number <span className="text-gray-400">(for calls/sms, optional)</span>
        </label>
        <input
          className="w-full rounded border bg-gray-50 px-3 py-2 text-base"
          type="tel"
          placeholder="e.g. 9876543210"
          value={editMobileNumber}
          onChange={e => setEditMobileNumber(e.target.value)}
          maxLength={20}
        />
      </div>
      {editError && <div className="text-sm text-destructive">{editError}</div>}
      <div className="mt-2 flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelEdit} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default SellerProfileEditForm;