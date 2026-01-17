import React, { useState, useEffect } from "react";
import { SellerProfileEditForm } from "@/components/seller-profile";
import { ProfilePhotoUploader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import DashboardLogoutButton from "@/components/Dashboard/DashboardLogoutButton";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Instagram, 
  Facebook, 
  Clock, 
  Building, 
  FileText,
  Edit3,
  ExternalLink
} from "lucide-react";

interface BuyerProfileEditFormProps {
  profile: any;
  user: any;
  onProfileUpdate: (profile: any) => void;
  onCancelEdit: () => void;
}

const BuyerProfileEditForm: React.FC<BuyerProfileEditFormProps> = ({
  profile,
  user,
  onProfileUpdate,
  onCancelEdit,
}) => {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || profile.name || user.name || user.first_name || "",
    email: profile.email || user.email || "",
    phone: profile.phone || user.phone || "",
    location: profile.location || user.location || "",
  });

  // Debug form initialization
  useEffect(() => {
    console.log("=== BUYER FORM DEBUG ===");
    console.log("Form initialized with:", formData);
    console.log("Profile data:", profile);
    console.log("User data:", user);
  }, [formData, profile, user]);

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      full_name: profile.full_name || profile.name || user.name || user.first_name || "",
      email: profile.email || user.email || "",
      phone: profile.phone || user.phone || "",
      location: profile.location || user.location || "",
    });
  }, [profile, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For buyers, just update the local profile data
    onProfileUpdate({ ...profile, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Mumbai, Delhi"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit">
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancelEdit}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

interface DashboardProfileContentProps {
  profile: any;
  user: any;
  onProfileUpdate: (profile: any) => void;
  onPhotoUpdate: (field: "avatar_url" | "background_photo_url", url: string) => Promise<void>;
  updatingPhoto: boolean;
}

const DashboardProfileContent: React.FC<DashboardProfileContentProps> = ({
  profile,
  user,
  onProfileUpdate,
  onPhotoUpdate,
  updatingPhoto,
}) => {
  const [editing, setEditing] = useState(false);

  // Debug: Let's see what data we receive
  useEffect(() => {
    console.log("=== PROFILE COMPONENT DEBUG ===");
    console.log("Profile received:", profile);
    console.log("User received:", user);
    console.log("Profile full_name:", profile?.full_name);
    console.log("Profile email:", profile?.email);
    console.log("Profile phone:", profile?.phone);
  }, [profile, user]);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center space-y-4">
            <ProfilePhotoUploader
              label="Profile Photo"
              currentUrl={profile.avatar_url}
              bucket="profile-photos"
              path={`avatars/${user.id}`}
              onUpload={url => onPhotoUpdate("avatar_url", url)}
              disabled={updatingPhoto}
              variant="hero"
            />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.full_name || profile.name || user.name || user.first_name || "Complete your profile"}
              </h2>
              {(profile.brand_name || profile.business_name) && (
                <p className="text-lg text-blue-600 font-medium mt-1">
                  {profile.brand_name || profile.business_name}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Contact Information
              </h3>
              <Button 
                variant="default" 
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                  {(() => {
                    // Check multiple possible email field names
                    const email = profile?.email || 
                                 user?.email || 
                                 profile?.user?.email ||
                                 profile?.email_address ||
                                 user?.email_address ||
                                 profile?.user_email ||
                                 user?.user_email;
                    return email ? (
                      <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                        {email}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    );
                  })()}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Mobile</p>
                  <p className="text-gray-900">
                    {profile.phone || profile.user?.phone || user.phone || <span className="text-gray-400">Not provided</span>}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                  <p className="text-gray-900">
                    {profile.location || <span className="text-gray-400">Not provided</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details Card - Only for Sellers */}
      {user?.seller && !editing ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Business Details
            </h3>
            <Button 
              variant="outline" 
              onClick={() => setEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Categories</span>
              </div>
              {Array.isArray(profile.categories) && profile.categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.categories.map((cat: string) => (
                    <span
                      key={cat}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">No categories selected</span>
              )}
            </div>

            {/* Business Hours */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Business Hours</span>
              </div>
              <p className="text-gray-900">
                {profile.business_hours || <span className="text-gray-400">Not specified</span>}
              </p>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Website</span>
              </div>
              {profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {profile.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-gray-400">No website provided</span>
              )}
            </div>

            {/* Social Media */}
            <div className="space-y-3">
              <span className="font-medium text-gray-700">Social Media</span>
              <div className="space-y-2">
                {profile.instagram ? (
                  <a
                    href={profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Instagram className="h-4 w-4" />
                    Instagram
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Instagram className="h-4 w-4" />
                    <span>Not connected</span>
                  </div>
                )}
                
                {profile.facebook ? (
                  <a
                    href={profile.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Facebook className="h-4 w-4" />
                    Facebook
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Facebook className="h-4 w-4" />
                    <span>Not connected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Locations Served */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Service Areas</span>
              </div>
              <p className="text-gray-900">
                {profile.locations_served || <span className="text-gray-400">Not specified</span>}
              </p>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Business Address</span>
              </div>
              <p className="text-gray-900">
                {profile.address || <span className="text-gray-400">Not provided</span>}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-700">Business Description</span>
              </div>
              <p className="text-gray-900 leading-relaxed">
                {profile.description || <span className="text-gray-400">No description provided</span>}
              </p>
            </div>
          </div>
        </div>
      ) : user?.seller ? (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <SellerProfileEditForm
            profile={profile}
            user={user}
            onProfileUpdate={p => {
              setEditing(false);
              onProfileUpdate(p);
            }}
            onCancelEdit={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <BuyerProfileEditForm
            profile={profile}
            user={user}
            onProfileUpdate={p => {
              setEditing(false);
              onProfileUpdate(p);
            }}
            onCancelEdit={() => setEditing(false)}
          />
        </div>
      )}

      {/* Logout Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
          <DashboardLogoutButton />
        </div>
      </div>
    </div>
  );
};

export default DashboardProfileContent;
