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
  const mainImage = images[1] || images[0] || "/assets/agency.jpg";
  const leftImage = images[2] || images[1] || images[0] || "/assets/agency.jpg";
  const rightImage = images[1] || images[0] || "/assets/agency.jpg";

  return (
    <section className="pb-40 px-4 md:px-0 flex flex-col gap-32">
      <div className="group w-full md:w-[80vw] h-[70vh] mx-auto overflow-hidden relative">
        <MotionImage
          src={mainImage}
          alt="Project Showcase Main"
          fill
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 1.5,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="object-cover grayscale brightness-90 contrast-110 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-7xl mx-auto px-6">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1 }}
          className="group relative h-[60vh] overflow-hidden"
        >
          <MotionImage
            src={leftImage}
            alt="Project Showcase Detail 1"
            fill
            className="object-cover grayscale brightness-90 contrast-110 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
          />
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 1,
            delay: 0.2,
          }}
          className="group relative h-[60vh] overflow-hidden md:mt-32"
        >
          <MotionImage
            src={rightImage}
            alt="Project Showcase Detail 2"
            fill
            className="object-cover grayscale brightness-90 contrast-110 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
          />
        </motion.div>
      </div>
    </section>
  );
}
