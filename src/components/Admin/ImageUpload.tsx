"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  uploadFolder?: string;
}

export function ImageUpload({ onUploadSuccess, currentImage, onRemove, uploadFolder }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File must be an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (uploadFolder) {
      formData.append("folder", uploadFolder);
    }

    setIsUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        onUploadSuccess(data.url);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (err) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (currentImage && (currentImage.startsWith("http") || currentImage.includes("/api/uploads/"))) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentImage }),
        });
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      {currentImage ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200">
          <Image src={currentImage} alt="Uploaded" fill className="object-cover" />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <Loader2 size={32} className="animate-spin text-zinc-400" />
          ) : (
            <>
              <Upload size={32} className="text-zinc-400" />
              <span className="text-sm text-zinc-500 font-semibold">Click to upload image</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
