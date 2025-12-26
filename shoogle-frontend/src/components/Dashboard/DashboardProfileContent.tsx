import React, { useState } from "react";
import { SellerProfileEditForm } from "@/components/seller-profile";
import { ProfilePhotoUploader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import DashboardLogoutButton from "@/components/Dashboard/DashboardLogoutButton";

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

  return (
    <div className="mb-8 rounded-xl bg-white p-4 shadow-sm sm:p-6 md:p-8">
      {/* Profile Overview */}
      <div className="mb-6 flex flex-col items-center gap-6 border-b pb-6 sm:flex-row sm:items-start">
        <div className="flex w-full flex-col items-center gap-2 sm:w-auto">
          <ProfilePhotoUploader
            label="Profile Photo"
            currentUrl={profile.avatar_url}
            bucket="profile-photos"
            path={`avatars/${user.id}`}
            onUpload={url => onPhotoUpdate("avatar_url", url)}
            disabled={updatingPhoto}
            variant="hero"
          />
          <span className="max-w-[180px] break-words text-center text-lg font-semibold">
            {profile.full_name || "N/A"}
          </span>
          <span className="max-w-[180px] break-words text-center text-sm text-muted-foreground">
            {profile.brand_name || ""}
          </span>
        </div>
        <div className="mt-4 flex w-full flex-1 flex-col items-center sm:mt-0 sm:items-start">
          <div className="mb-2 w-full max-w-xs break-words px-2 sm:max-w-full sm:px-0">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Email</span>
            <div className="break-all text-base">
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="break-all text-blue-600 underline">
                  {profile.email}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
          </div>
          <div className="mb-2 w-full max-w-xs break-words px-2 sm:max-w-full sm:px-0">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Mobile Number
            </span>
            <div className="text-base">
              {profile.user?.phone || <span className="text-gray-400">N/A</span>}
            </div>
          </div>
          <div className="mb-2 w-full max-w-xs break-words px-2 sm:max-w-full sm:px-0">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Location</span>
            <div className="text-base">
              {profile.location || <span className="text-gray-400">N/A</span>}
            </div>
          </div>
        </div>
      </div>
      {/* Business Details */}
      {!editing ? (
        <div>
          <div className="mb-6 flex flex-col gap-3">
            <div>
              <span className="font-semibold">Categories:</span>{" "}
              {Array.isArray(profile.categories) && profile.categories.length > 0 ? (
                <span className="inline-flex flex-wrap gap-1">
                  {profile.categories.map((cat: string) => (
                    <span
                      key={cat}
                      className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                    >
                      {cat}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
            <div>
              <span className="font-semibold">Business Hours:</span>{" "}
              {profile.business_hours || <span className="text-gray-400">N/A</span>}
            </div>
            <div className="break-words">
              <span className="font-semibold">Website:</span>{" "}
              {profile.website ? (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 underline"
                >
                  {profile.website}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
            <div className="break-words">
              <span className="font-semibold">Instagram:</span>{" "}
              {profile.instagram ? (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 underline"
                >
                  {profile.instagram}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
            <div className="break-words">
              <span className="font-semibold">Facebook:</span>{" "}
              {profile.facebook ? (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 underline"
                >
                  {profile.facebook}
                </a>
              ) : (
                <span className="text-gray-400">N/A</span>
              )}
            </div>
            <div>
              <span className="font-semibold">Locations Served:</span>{" "}
              {profile.locations_served || <span className="text-gray-400">N/A</span>}
            </div>
            <div className="break-words">
              <span className="font-semibold">Address:</span>{" "}
              {profile.address || <span className="text-gray-400">N/A</span>}
            </div>
            <div className="break-words">
              <span className="font-semibold">Description:</span>{" "}
              {profile.description || <span className="text-gray-400">N/A</span>}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button variant="default" className="w-full sm:w-auto" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          </div>
        </div>
      ) : (
        <SellerProfileEditForm
          profile={profile}
          user={user}
          onProfileUpdate={p => {
            setEditing(false);
            onProfileUpdate(p);
          }}
          onCancelEdit={() => setEditing(false)}
        />
      )}
      {/* Logout Button at the bottom */}
      <div className="mb-4 mt-4 flex justify-center">
        <DashboardLogoutButton />
      </div>
    </div>
  );
};

export default DashboardProfileContent;
