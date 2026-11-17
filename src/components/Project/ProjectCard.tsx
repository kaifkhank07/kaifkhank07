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
      className="group relative block w-full aspect-[4/5] overflow-hidden bg-zinc-900 border border-zinc-800/40"
      data-cursor-text="OPEN"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover grayscale-0 brightness-100 contrast-100 lg:grayscale lg:brightness-90 lg:contrast-110 transition-all duration-700 lg:duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:contrast-100 lg:group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 lg:from-black/40 lg:via-black/40 lg:to-black/40 lg:group-hover:from-black/80 lg:group-hover:via-black/25 lg:group-hover:to-transparent transition-all duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7 xl:p-8 flex justify-between items-end z-10">
        <div className="overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white translate-y-0 opacity-100 lg:translate-y-[100%] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]">
            {title}
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base mt-1.5 font-medium translate-y-0 opacity-100 lg:translate-y-[100%] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-700 lg:delay-100 ease-[cubic-bezier(0.77,0,0.175,1)]">
            {category}
          </p>
        </div>
      </div>
    </Link>
  );
}
