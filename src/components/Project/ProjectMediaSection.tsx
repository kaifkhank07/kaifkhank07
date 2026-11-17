"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectMediaSectionProps {
  images: string[];
}

export default function ProjectMediaSection({ images }: ProjectMediaSectionProps) {
  const validImages = images && images.length > 0 ? images : ["/assets/Images/regular/agency.jpg"];
  const mainImage = validImages[1];
  const secondImage = validImages[2];
  const thirdImage = validImages[3];
  const fourthImage = validImages[4];

  return (
    <section className="relative w-full py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* Main Showcase Image (1st Image) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 1.2,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="group w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative bg-zinc-100 shadow-sm"
        >
          <Image
            src={mainImage}
            alt="Project Showcase Main"
            fill
            sizes="(max-width: 1024px) 100vw, 1450px"
            className="object-cover grayscale-0 brightness-100 contrast-100 lg:grayscale lg:brightness-95 lg:contrast-105 transition-all duration-700 lg:duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:contrast-100 lg:group-hover:scale-105"
          />
        </motion.div>

        {/* Supporting Details Images (2nd & 3rd Images) */}
        {(secondImage || thirdImage) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
            {secondImage && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1 }}
                className="group relative aspect-[4/3] overflow-hidden bg-zinc-100 shadow-sm"
              >
                <Image
                  src={secondImage}
                  alt="Project Showcase Detail 1"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale-0 brightness-100 contrast-100 lg:grayscale lg:brightness-95 lg:contrast-105 transition-all duration-700 lg:duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:contrast-100 lg:group-hover:scale-105"
                />
              </motion.div>
            )}

            {thirdImage && (
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
                <Image
                  src={thirdImage}
                  alt="Project Showcase Detail 2"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale-0 brightness-100 contrast-100 lg:grayscale lg:brightness-95 lg:contrast-105 transition-all duration-700 lg:duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:contrast-100 lg:group-hover:scale-105"
                />
              </motion.div>
            )}
          </div>
        )}

        {/* 4th Image: Additional Showcase Feature Image */}
        {fourthImage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 1.2,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="group w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative bg-zinc-100 shadow-sm"
          >
            <Image
              src={fourthImage}
              alt="Project Showcase Detail 3"
              fill
              sizes="(max-width: 1024px) 100vw, 1450px"
              className="object-cover grayscale-0 brightness-100 contrast-100 lg:grayscale lg:brightness-95 lg:contrast-105 transition-all duration-700 lg:duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:contrast-100 lg:group-hover:scale-105"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
