"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadMultipleSuccess?: (urls: string[]) => void;
  currentImage?: string;
  onRemove?: () => void;
  uploadFolder?: string;
  multiple?: boolean;
  maxFiles?: number;
}

export function ImageUpload({
  onUploadSuccess,
  onUploadMultipleSuccess,
  currentImage,
  onRemove,
  uploadFolder,
  multiple = false,
  maxFiles,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    if (maxFiles && files.length > maxFiles) {
      toast.error(`You can upload a maximum of ${maxFiles} image${maxFiles > 1 ? "s" : ""}`);
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 5MB size limit`);
        e.target.value = "";
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file`);
        e.target.value = "";
        return;
      }
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(multiple ? "files" : "file", file);
    });

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
        if (multiple && onUploadMultipleSuccess && Array.isArray(data.urls)) {
          onUploadMultipleSuccess(data.urls);
        } else if (Array.isArray(data.urls)) {
          data.urls.forEach((u: string) => onUploadSuccess(u));
        } else if (data.url) {
          onUploadSuccess(data.url);
        }
        toast.success(
          files.length > 1
            ? `${files.length} images uploaded successfully`
            : "Image uploaded successfully"
        );
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      e.target.value = "";
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
      } catch {
        console.error("Failed to delete image");
      }
    }
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      {currentImage ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200">
          <Image src={currentImage} alt="Uploaded" fill className="object-cover object-top" />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
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
              <span className="text-sm text-zinc-500 font-semibold text-center px-2">
                {multiple ? "Click to upload image(s)" : "Click to upload image"}
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
