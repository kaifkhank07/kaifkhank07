"use client";

import { useState } from "react";
import { Button } from "@/components/Admin/Button";
import { Input } from "@/components/Admin/Input";
import toast from "react-hot-toast";

export default function ProfileAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Password updated successfully");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-zinc-200">
      <h2 className="text-xl font-bold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          label="Current Password" 
          type="password"
          value={formData.currentPassword} 
          onChange={e => setFormData({ ...formData, currentPassword: e.target.value })} 
          required 
        />
        <Input 
          label="New Password" 
          type="password"
          value={formData.newPassword} 
          onChange={e => setFormData({ ...formData, newPassword: e.target.value })} 
          required 
        />
        <Input 
          label="Confirm New Password" 
          type="password"
          value={formData.confirmPassword} 
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} 
          required 
        />
        <div className="pt-2">
          <Button type="submit" isLoading={isLoading} className="w-full">Update Password</Button>
        </div>
      </form>
    </div>
  );
}
