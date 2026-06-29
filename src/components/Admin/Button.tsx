"use client";

import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export function Button({ 
  children, 
  className, 
  variant = "primary", 
  isLoading, 
  disabled, 
  ...props 
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-400",
    secondary: "bg-zinc-200 text-black hover:bg-zinc-300 disabled:bg-zinc-100",
    danger: "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300",
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
