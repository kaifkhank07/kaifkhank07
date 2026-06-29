"use client";

import { HTMLProps } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <input
        className={twMerge(
          "px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends HTMLProps<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <textarea
        className={twMerge(
          "px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all min-h-[100px]",
          className
        )}
        {...props}
      />
    </div>
  );
}
