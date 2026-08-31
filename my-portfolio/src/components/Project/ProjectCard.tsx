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
      className="group block relative w-full h-[60vh] overflow-hidden bg-zinc-900"
      data-cursor-text="OPEN"
    >
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1 }}
        className="group relative h-[60vh] overflow-hidden"
      >
        <MotionImage
          src={image}
          alt={title}
          fill
          className="object-cover grayscale brightness-90 contrast-110 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
        />
      </motion.div>

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
