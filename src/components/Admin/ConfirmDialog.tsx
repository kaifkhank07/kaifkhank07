"use client";

import { X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, isLoading }: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-black w-full max-w-md rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <h3 className="text-xl font-bold">{title}</h3>
          <button 
            onClick={onCancel}
            disabled={isLoading}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-zinc-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="button" onClick={onConfirm} isLoading={isLoading}>Confirm</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
