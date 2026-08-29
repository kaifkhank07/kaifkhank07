"use client";

import { HTMLProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label: string;
  rightElement?: ReactNode;
}

export function Input({
  label,
  className,
  rightElement,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>

      <div className="relative">
        <input
          className={twMerge(
            "w-full px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all",
            rightElement && "pr-12",
            className
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
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

interface SelectProps extends Omit<HTMLProps<HTMLSelectElement>, "label"> {
  label: string;
  options: { label: string; value: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-zinc-700">{label}</label>
      <select
        className={twMerge(
          "px-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}