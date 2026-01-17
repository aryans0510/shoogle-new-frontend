import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Facebook, Instagram, Globe } from "lucide-react";
import { WhatsAppCTAButton } from "@/components/common";

interface SellerProfileHeaderProps {
  profile: any;
  canEdit: boolean;
  isEditing: boolean;
  showNewlyVerified: boolean;
  onBack: () => void;
  onEditToggle: () => void;
  setEditFields: (fields: { name: string; value: string }[]) => void;
  headerFade?: number;
}

const SellerProfileHeader: React.FC<SellerProfileHeaderProps> = ({
  profile,
  canEdit,
  isEditing,
  showNewlyVerified,
  onBack,
  onEditToggle,
  setEditFields,
  headerFade = 1,
}) => {
  const categories: string[] =
    profile.listings && Array.isArray(profile.listings)
      ? Array.from(
          new Set(
            profile.listings
              .map((l: any) => l.category as string | undefined)
              .filter((c): c is string => !!c),
          ),
        )
      : [];

  const dissolveStyle: React.CSSProperties = {
    opacity: headerFade,
    transform: `translateY(-${10 * (1 - headerFade)}px)`,
    transition:
      "opacity 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1)",
    willChange: "opacity,transform",
    pointerEvents: headerFade < 0.1 ? "none" : "auto",
  };

  return (
    <div
      className="sticky top-0 z-30 mb-4 flex flex-col gap-4 border-b border-gray-100 bg-white pt-2 pb-3 shadow-sm transition-shadow sm:flex-row sm:items-center sm:gap-4 md:shadow-xs"
      style={{
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        ...dissolveStyle,
      }}
    >
      <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
        <div className="flex w-full sm:w-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mb-2 sm:mb-3"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-4xl font-bold text-gray-500 sm:h-16 sm:w-16 sm:text-3xl">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
          ) : profile.full_name ? (
            profile.full_name[0].toUpperCase()
          ) : (
            "?"
          )}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className="truncate text-center text-2xl font-bold sm:text-left sm:text-xl">
            {profile.full_name || "Seller"}
          </span>
          {profile.is_verified && (
            <Badge
              variant="secondary"
              className="ml-1 border-green-300 bg-green-100 px-2 py-0.5 text-xs text-green-700"
            >
              Verified Seller{" "}
              {showNewlyVerified && (
                <span className="ml-1 rounded bg-green-50 px-1 text-[10px] font-semibold text-green-900">
                  New!
                </span>
              )}
            </Badge>
          )}
        </div>
        {!!profile.description && (
          <div className="mt-0.5 line-clamp-2 text-center text-sm text-gray-700 sm:text-left">
            {profile.description}
          </div>
        )}
        {!!profile.brand_name && (
          <div className="text-center text-sm text-muted-foreground sm:text-left">
            {profile.brand_name}
          </div>
        )}
        <div className="mt-2 flex w-full flex-wrap justify-center gap-x-2 gap-y-1 sm:justify-start">
          <span className="text-xs text-muted-foreground">
            Active since {profile.activeSince ?? "–"}
          </span>
          {profile.location && (
            <span className="text-xs text-muted-foreground">• {profile.location}</span>
          )}
          {!!profile.locations_served && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              Serves: {profile.locations_served}
            </span>
          )}
          <span className="text-xs text-gray-400">Last seen: {profile.lastSeen}</span>
        </div>
        <div className="mt-2 flex w-full flex-wrap justify-center gap-2 sm:justify-start">
          {categories.map(c => (
            <Badge key={c} variant="outline" className="rounded-full px-2 py-1 text-xs">
              {c}
            </Badge>
          ))}
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 sm:justify-start">
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow"
              style={{ minWidth: 110, justifyContent: "center" }}
            >
              <Globe size={16} /> Website
            </a>
          )}
          {profile.instagram && (
            <a
              href={profile.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-pink-500 bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm transition-all hover:bg-pink-50 hover:shadow"
              style={{ minWidth: 110, justifyContent: "center" }}
            >
              <Instagram size={16} /> Instagram
            </a>
          )}
          {profile.facebook && (
            <a
              href={profile.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-blue-700 bg-white px-4 py-2 text-sm font-semibold text-blue-800 shadow-sm transition-all hover:bg-blue-50 hover:shadow"
              style={{ minWidth: 110, justifyContent: "center" }}
            >
              <Facebook size={16} /> Facebook
            </a>
          )}
          {!!profile.mobile_number && (
            <a
              href={`tel:${profile.mobile_number.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-1 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm transition-all hover:bg-green-50 hover:shadow"
              style={{ minWidth: 110, justifyContent: "center" }}
            >
              <Phone size={16} /> Call
            </a>
          )}
          {profile.whatsapp && (
            <div className="flex w-full justify-center sm:w-auto sm:justify-start">
              <WhatsAppCTAButton
                whatsappLink={
                  profile.whatsapp.startsWith("http")
                    ? profile.whatsapp
                    : `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`
                }
              />
            </div>
          )}
          {canEdit && (
            <Button
              variant={isEditing ? "secondary" : "outline"}
              size="sm"
              className="ml-0 rounded-lg shadow-sm transition-all hover:shadow sm:ml-3"
              onClick={onEditToggle}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfileHeader;