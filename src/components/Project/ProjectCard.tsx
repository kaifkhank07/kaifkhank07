"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  image: string;
}

export default function ProjectCard({
  slug,
  title,
  category,
  image,
}: ProjectCardProps) {
  const MotionImage = motion(Image);

  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative block w-full aspect-[4/5] overflow-hidden bg-zinc-900 border border-zinc-800/40"
      data-cursor-text="OPEN"
    >
      {/* Background Image */}
      <MotionImage
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover grayscale brightness-90 contrast-110 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:grayscale-0 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent group-hover:from-black/60 group-hover:via-transparent transition-all duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7 xl:p-8 flex justify-between items-end z-10">
        <div className="overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:translate-x-1 transition-transform duration-500 origin-left">
            {title}
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base mt-1.5 font-medium">
            {category}
          </p>
        </div>
      </div>
    </Link>
  );
}
