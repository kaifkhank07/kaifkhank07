"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Resume() {
  const [resumeUrl, setResumeUrl] = useState("/resume.pdf"); // fallback

  useEffect(() => {
    fetch("/api/about")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.resumeUrl) {
          setResumeUrl(data.data.resumeUrl);
        }
      })
      .catch(err => console.error("Error fetching resume URL:", err));
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (resumeUrl === "/resume.pdf") {
      e.preventDefault();
      toast.error("No resume uploaded yet. Please add one in the Admin panel!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 1,
        ease: [0.77, 0, 0.175, 1],
      }}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50"
    >
      <a
        href={resumeUrl.startsWith("http") ? `/api/download?url=${encodeURIComponent(resumeUrl)}` : resumeUrl}
        download="resume.pdf"
        onClick={handleClick}
        className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border border-zinc-300 bg-white/80 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-black"
      >
        <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

        <span className="relative z-10 flex flex-col items-center gap-1 text-black group-hover:text-white transition-colors duration-500">
          <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em]">
            Resume
          </span>

          <span className="text-lg sm:text-xl md:text-2xl transition-transform duration-500 group-hover:translate-y-1">
            ↓
          </span>
        </span>
      </a>
    </motion.div>
  );
}
