"use client";

import { motion } from "framer-motion";

interface ProjectHeroProps {
  project: {
    title: string;
    category?: string;
  };
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="relative w-full h-screen flex items-center justify-center py-8 lg:py-12 lg:pt-28 px-4 md:px-6 lg:px-16 overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="absolute inset-0 bg-black pointer-events-none"
      />

      <div className="relative max-w-8xl 3xl:max-w-[1450px] mx-auto w-full z-10 mix-blend-difference text-center flex flex-col items-center justify-center">
        {project.category && (
          <motion.span
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="text-xs sm:text-sm font-mono tracking-[0.25em] text-zinc-400 uppercase mb-4 sm:mb-6"
          >
            {project.category}
          </motion.span>
        )}

        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] 3xl:text-[10rem] font-black uppercase tracking-tighter leading-none"
        >
          {project.title || "PROJECT"}
        </motion.h1>
      </div>
    </section>
  );
}
