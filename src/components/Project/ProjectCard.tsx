"use client";

import Link from "next/link";
import Image from "next/image";

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
  return (
    <Link
      href={`/projects/${slug}`}
      className="group block relative w-full aspect-[4/5] overflow-hidden bg-zinc-900"
      data-cursor-text="OPEN"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover grayscale brightness-90 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:grayscale-0 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end mix-blend-difference z-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white group-hover:rotate-1 group-hover:skew-x-2 transition-transform duration-500 origin-left">
            {title}
          </h2>

          <p className="text-zinc-400 mt-2">{category}</p>
        </div>
      </div>
    </Link>
  );
}
