"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectMediaSectionProps {
  images: string[];
}

export default function ProjectMediaSection({ images }: ProjectMediaSectionProps) {
  const MotionImage = motion(Image);

  // The hero uses the 1st image (images[0])
  // The media section uses the next two images (images[1] and images[2])
  const mainImage = images[0] || "/assets/Images/regular/agency.jpg";
  const leftImage = images[1] || "/assets/Images/regular/agency.jpg";
  const rightImage = images[2] || "/assets/Images/regular/agency.jpg";

  return (
    <section className="relative w-full py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* Main Showcase Image */}
        <div className="group w-full aspect-[16/9] overflow-hidden relative bg-zinc-100 shadow-sm">
          <MotionImage
            src={mainImage}
            alt="Project Showcase Main"
            fill
            sizes="(max-width: 1024px) 100vw, 1450px"
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1.5,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="object-cover grayscale brightness-95 contrast-105 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
          />
        </div>

        {/* Supporting Details Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
            className="group relative aspect-[4/3] overflow-hidden bg-zinc-100 shadow-sm"
          >
            <MotionImage
              src={leftImage}
              alt="Project Showcase Detail 1"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale brightness-95 contrast-105 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
            />
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
            className="group relative aspect-[4/3] overflow-hidden bg-zinc-100 shadow-sm md:mt-20"
          >
            <MotionImage
              src={rightImage}
              alt="Project Showcase Detail 2"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale brightness-95 contrast-105 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
