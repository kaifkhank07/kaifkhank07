"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/variants";
import Link from "next/link";
import Image from "next/image";

interface FeaturedProject {
  slug: string;
  title: string;
  category: string;
  image: string;
}

interface RawProject {
  slug?: string;
  title: string;
  category: string;
  images?: string[];
}

export default function FeaturedWork() {
  const [projectsList, setProjectsList] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/projects?showOnHome=true&visibility=true")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.data && data.data.length > 0) {
          // Format the data to match expected fields
          const formattedData: FeaturedProject[] = data.data.map((p: RawProject) => ({
            slug: p.slug || "",
            title: p.title,
            category: p.category,
            image: p.images && p.images.length > 0 ? p.images[0] : "/assets/Images/regular/agency.jpg",
          }));
          setProjectsList(formattedData);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative w-full py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="enter"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full flex flex-col gap-10 sm:gap-16"
        >
          <div className="flex justify-between items-end pb-6 sm:pb-8 border-b border-zinc-800">
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

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
              <div className="aspect-[4/5] bg-zinc-900/40 animate-pulse border border-zinc-800/50" />
              <div className="aspect-[4/5] bg-zinc-900/40 animate-pulse border border-zinc-800/50 hidden sm:block" />
              <div className="aspect-[4/5] bg-zinc-900/40 animate-pulse border border-zinc-800/50 hidden lg:block" />
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
              {projectsList.map((project, idx) => (
                <motion.div
                  key={project.slug || idx}
                  variants={fadeUp}
                  initial="initial"
                  whileInView="enter"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative block w-full aspect-[4/5] overflow-hidden bg-zinc-900 border border-zinc-800/40"
                    data-cursor-text="VIEW"
                  >
                    {/* Background Image */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale-0 brightness-100 contrast-100 lg:grayscale lg:brightness-90 lg:contrast-110 transition-all duration-700 lg:duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] lg:group-hover:grayscale-0 lg:group-hover:brightness-100 lg:group-hover:contrast-100 lg:group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 lg:from-black/40 lg:via-black/40 lg:to-black/40 lg:group-hover:from-black/80 lg:group-hover:via-black/25 lg:group-hover:to-transparent transition-all duration-500" />

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 w-full p-6 sm:p-7 xl:p-8 flex justify-between items-end z-10">
                      <div className="overflow-hidden">
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white translate-y-0 opacity-100 lg:translate-y-[100%] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]">
                          {project.title}
                        </h3>

                        <p className="text-zinc-300 text-sm sm:text-base mt-1.5 font-medium translate-y-0 opacity-100 lg:translate-y-[100%] lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-700 lg:delay-100 ease-[cubic-bezier(0.77,0,0.175,1)]">
                          {project.category}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
