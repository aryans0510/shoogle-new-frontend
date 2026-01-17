import React, { useRef, useState } from "react";
import { Plus, Image, Upload, CheckCircle } from "lucide-react";

/**
 * Enhanced hero illustration for Add Media area
 */
function MediaHeroIcon() {
  return (
    <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/10 border-2 border-dashed border-blue-300">
      <Upload className="h-8 w-8 text-blue-600 opacity-90" />
      <Image className="absolute -bottom-2 -right-2 h-6 w-6 text-purple-600 drop-shadow-sm bg-white rounded-full p-1" />
    </div>
  );
}

interface Media {
  url: string;
  type: "image" | "video";
  file: File;
}
interface MediaUploadProps {
  value: Media[];
  onChange: (files: Media[]) => void;
  maxFiles?: number;
}

export default function MediaUpload({ value, onChange, maxFiles = 3 }: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    let newFiles: Media[] = [];
    let images = value.filter(m => m.type === "image");

    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        if (images.length < 3 && value.length < maxFiles) {
          newFiles.push({
            url: URL.createObjectURL(file),
            type: "image",
            file,
          });
          images.push({ url: "", type: "image", file });
        }
      }
      // Videos are no longer supported - only images allowed
    });

    if (newFiles.length) {
      onChange([...value, ...newFiles].slice(0, maxFiles));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Enhanced dropzone with better visual feedback */}
      <div
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-gradient-to-br transition-all duration-300 ${
          dragActive 
            ? "scale-[1.02] border-blue-500 bg-blue-50 shadow-lg" 
            : value.length > 0
            ? "border-green-300 bg-green-50/50 hover:border-green-400"
            : "border-gray-300 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/50"
        } px-6 py-12 shadow-sm hover:shadow-md`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        tabIndex={0}
        role="button"
        aria-label="Add photos"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInput}
        />
        
        {value.length > 0 ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <span className="text-lg font-semibold text-green-700 mb-1">
              {value.length} image{value.length > 1 ? 's' : ''} added
            </span>
            <span className="text-sm text-green-600 mb-2">
              Click to add more (up to 3 total)
            </span>
            <span className="text-xs text-gray-500">
              Drag & drop or <span className="text-blue-600 underline font-medium">browse files</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <MediaHeroIcon />
            <span className="text-lg font-semibold text-gray-700 mb-1">
              Add photos
            </span>
            <span className="text-sm text-gray-500 mb-2">
              Up to 3 high-quality images
            </span>
            <span className="text-xs text-gray-400">
              Drag & drop or <span className="text-blue-600 underline font-medium">browse files</span>
            </span>
          </div>
        )}
      </div>

      {/* Enhanced media preview with better layout */}
      {value.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Your Images</h4>
            <span className="text-xs text-gray-500">{value.length}/3 images</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {value.map((media, idx) => (
              <div key={idx} className="group relative">
                <img
                  src={media.url}
                  alt={`Preview ${idx + 1}`}
                  className="aspect-square w-full rounded-xl border-2 border-gray-200 bg-gray-100 object-cover shadow-sm transition-all group-hover:shadow-md"
                />
                {/* Enhanced remove button */}
                <button
                  type="button"
                  className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-lg transition-all hover:bg-red-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  aria-label={`Remove image ${idx + 1}`}
                >
                  ×
                </button>
                {/* Image number indicator */}
                <div className="absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-medium text-white">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
