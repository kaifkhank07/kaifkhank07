"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/variants";
import Link from "next/link";
import Image from "next/image";

export default function FeaturedWork() {
  const [projectsList, setProjectsList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects?showOnHome=true&visibility=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          // Format the data to match expected fields
          const formattedData = data.data.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            image: p.images && p.images.length > 0 ? p.images[0] : "/assets/Images/regular/agency.jpg",
          }));
          setProjectsList(formattedData);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <section className="relative py-32 px-4 md:px-12 w-full bg-zinc-950">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="enter"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto flex flex-col gap-24"
      >
        <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-8">
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            SELECTED RECENT WORK
          </motion.h2>

          <motion.span
            variants={fadeUp}
            className="hidden md:block text-zinc-500"
          >
            (2025/2026)
          </motion.span>
        </div>

        {projectsList.map((project, idx) => (
          <motion.div key={project.slug || idx} variants={fadeUp}>
            <Link
              href={`/projects/${project.slug}`}
              className="group relative block w-full h-[60vh] md:h-[80vh] overflow-hidden bg-zinc-900"
              data-cursor-text="VIEW"
            >
              {/* Background Image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover grayscale brightness-90 contrast-110 transition-all duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:grayscale-0 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end z-10">
                <div className="overflow-hidden">
                  <h3 className="text-3xl md:text-5xl font-bold translate-y-[100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]">
                    {project.title}
                  </h3>

                  <p className="text-zinc-300 mt-2 translate-y-[100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100 ease-[cubic-bezier(0.77,0,0.175,1)]">
                    {project.category}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
