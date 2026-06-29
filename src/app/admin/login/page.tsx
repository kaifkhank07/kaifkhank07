"use client";

import { useState } from "react";
import { Input } from "@/components/Admin/Input";
import { Button } from "@/components/Admin/Button";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Login successful");
        window.location.href = "/admin/dashboard";
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-zinc-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black uppercase tracking-widest">Admin</h1>
          <p className="text-zinc-500 mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" 
            type="email" 
            name="email" 
            required 
            placeholder="admin@example.com"
          />
          <Input 
            label="Password" 
            type="password" 
            name="password" 
            required 
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
