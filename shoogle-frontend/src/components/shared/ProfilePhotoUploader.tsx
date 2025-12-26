import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
interface ProfilePhotoUploaderProps {
  label: string;
  currentUrl: string | null;
  bucket: string;
  path: string;
  onUpload: (url: string) => void;
  disabled?: boolean;
  // Optional: add a variant prop to switch hero/card design
  variant?: "hero" | "default";
}
// Note: Profile photo uploads should use backend API
// For now, this function is kept for compatibility but should be replaced
const getPublicUrl = (bucket: string, path: string) => {
  // TODO: Replace with backend API call for profile photo URLs
  return path; // Return path as-is for now
};
const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  label,
  currentUrl,
  bucket,
  path,
  onUpload,
  disabled,
  variant = "default",
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const uploadPath = `${path}.${fileExt}`;

    // TODO: Implement profile photo upload via backend API
    // For now, create a data URL as a temporary solution
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      onUpload(dataUrl);
      setUploading(false);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
    return;
    setUploading(false);
  };

  // Hero variant: circular, large, floating camera button
  if (variant === "hero") {
    return (
      <div className="relative flex min-w-0 flex-1 flex-col items-center gap-2">
        <div className="group relative h-36 w-36">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={label}
              className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-xl"
              style={{
                boxShadow: "0 4px 40px 0 rgba(0,0,0,0.20)",
                background: "#fff",
              }}
            />
          ) : (
            <div className="flex h-36 w-36 select-none items-center justify-center rounded-full border-4 border-white bg-gray-200 text-5xl font-semibold text-gray-400 shadow-xl">
              ?
            </div>
          )}
          {/* Camera button, bottom right */}
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading || disabled}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || disabled}
            className="absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-black/80 shadow-lg transition-all hover:bg-black focus:outline-hidden"
            aria-label="Upload photo"
            style={{
              zIndex: 10,
            }}
          >
            <Camera className="h-6 w-6 text-white" />
          </button>
          {uploading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-white/60">
              <span className="font-medium text-gray-500">Uploading...</span>
            </div>
          )}
        </div>
        {/* Edit label */}
        <div className="pt-2"></div>
        {error && <span className="mt-1 text-center text-xs text-destructive">{error}</span>}
      </div>
    );
  }

  // Default variant fallback (old design for card etc)
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      {currentUrl ? (
        <img
          src={currentUrl}
          alt={label}
          className={
            label === "Profile Photo"
              ? "h-20 w-20 rounded-full border object-cover"
              : "h-28 w-full rounded-lg border object-cover"
          }
        />
      ) : (
        <div
          className={
            label === "Profile Photo"
              ? "flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-center text-gray-400"
              : "flex h-28 w-full items-center justify-center rounded-lg bg-gray-200 text-center text-gray-400"
          }
        >
          {label === "Profile Photo" ? "No Profile Photo" : "No Background Photo"}
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading || disabled}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
        disabled={uploading || disabled}
      >
        {uploading ? "Uploading..." : (currentUrl ? "Change" : "Upload") + ` ${label}`}
      </Button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
};
export default ProfilePhotoUploader;
