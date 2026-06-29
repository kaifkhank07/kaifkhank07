"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Admin/Button";
import { Input, Textarea } from "@/components/Admin/Input";
import { ImageUpload } from "@/components/Admin/ImageUpload";
import { FileUpload } from "@/components/Admin/FileUpload";
import toast from "react-hot-toast";

export default function AboutAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    story: "",
    profileImage: "",
    resumeUrl: ""
  });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        const data = await res.json();
        if (data.success && data.data) {
          setFormData({
            name: data.data.name || "",
            story: data.data.story || "",
            profileImage: data.data.profileImage || "",
            resumeUrl: data.data.resumeUrl || ""
          });
        }
      } catch (err) {
        toast.error("Failed to load about data");
      }
    };
    fetchAbout();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("About section updated");
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">Profile Image</label>
          <ImageUpload 
            currentImage={formData.profileImage}
            onUploadSuccess={(url) => setFormData({ ...formData, profileImage: url })}
            onRemove={() => setFormData({ ...formData, profileImage: "" })}
          />
        </div>
        <Input 
          label="Name" 
          value={formData.name} 
          onChange={e => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
        <Textarea 
          label="Story" 
          value={formData.story} 
          onChange={e => setFormData({ ...formData, story: e.target.value })} 
          required 
          rows={6}
        />
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-700">Resume (PDF)</label>
          <FileUpload 
            currentFile={formData.resumeUrl}
            onUploadSuccess={(url) => setFormData({ ...formData, resumeUrl: url })}
            onRemove={() => setFormData({ ...formData, resumeUrl: "" })}
          />
        </div>
        <div className="pt-4 flex justify-end">
          <Button type="submit" isLoading={isLoading}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
