'use client';

import { motion } from 'framer-motion';

interface ProjectHeroProps {
  project: any;
}

export default function ProjectHero({
  project,
}: ProjectHeroProps) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="absolute inset-0 bg-black"
      />

      <div className="z-10 mix-blend-difference text-center px-4">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.5,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="text-6xl md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter"
        >
          {project.title || 'PROJECT'}
        </motion.h1>
      </div>
    </section>
  );
}