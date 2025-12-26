import React, { useRef, useState } from "react";
import { Plus, Image } from "lucide-react";

/**
 * Hero illustration for Add Media area (SVG, Instagram style)
 */
function MediaHeroIcon() {
  return (
    <div className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-tr from-primary/20 via-accent/20 to-secondary/10">
      <Plus className="h-9 w-9 text-primary opacity-90" />
      <Image className="absolute -bottom-1.5 -right-1.5 h-5 w-5 text-accent drop-shadow-sm" />
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
      {/* Instagram-style dropzone */}
      <div
        className={`mb-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-background px-4 py-12 shadow-md outline-hidden transition-all ${dragActive ? "scale-105 border-primary bg-accent/20" : "border-muted bg-muted/30 hover:border-primary/70"} `}
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
        aria-label="Add photos or videos"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInput}
        />
        <MediaHeroIcon />
        <div className="flex flex-col items-center">
          <span className="mb-1 text-base font-semibold text-foreground">
            Add photos
          </span>
          <span className="mb-1 text-xs text-muted-foreground">
            Up to 3 images
          </span>
        </div>
        <span className="text-[13px] text-muted-foreground">
          Drag & drop, or <span className="text-primary underline">browse files</span>
        </span>
      </div>

      {/* Instagram-style horizontal scroll media preview */}
      {value.length > 0 && (
        <div className="scrollbar-thin scrollbar-thumb-muted/40 flex gap-3 overflow-x-auto px-1 pb-2 pt-1">
          {value.map((media, idx) => (
            <div key={idx} className="group relative shrink-0">
              <img
                src={media.url}
                alt={`media-preview-${idx}`}
                className="h-24 w-24 rounded-md border border-muted bg-muted object-cover"
              />
              {/* X Remove */}
              <button
                type="button"
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-muted bg-background text-lg text-muted-foreground shadow-md hover:text-destructive focus:outline-hidden"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
