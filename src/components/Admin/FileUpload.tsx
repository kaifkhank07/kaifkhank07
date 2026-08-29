"use client";

import { useState } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  currentFile?: string;
  onRemove?: () => void;
  uploadFolder?: string;
}

export function FileUpload({ onUploadSuccess, currentFile, onRemove, uploadFolder }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("File must be a PDF");
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
        toast.success("File uploaded successfully");
      } else {
        toast.error(data.error || "Failed to upload file");
      }
    } catch (err) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (currentFile && (currentFile.startsWith("http") || currentFile.includes("/api/uploads/"))) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentFile }),
        });
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-2">
      {currentFile ? (
        <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-medium text-sm">Resume Document</p>
              <a href={currentFile} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                View current file
              </a>
            </div>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      ) : (
        <div className="relative w-full h-24 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 hover:bg-zinc-100 transition-colors flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <Loader2 size={24} className="animate-spin text-zinc-400" />
          ) : (
            <>
              <Upload size={24} className="text-zinc-400" />
              <span className="text-sm text-zinc-500 font-semibold">Click to upload PDF</span>
            </>
          )}
          <input
            type="file"
            accept="application/pdf"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      )}
    </div>
  );
}
