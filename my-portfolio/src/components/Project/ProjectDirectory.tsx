"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/variants";
import ProjectCard from "@/components/Project/ProjectCard";

export default function ProjectDirectory() {
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/projects?visibility=true")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.data && data.data.length > 0) {
          const formattedData = data.data.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            image:
              p.images && p.images.length > 1
                ? p.images[1]
                : p.images && p.images.length > 0
                ? p.images[0]
                : "/assets/Images/regular/agency.jpg",
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
    <section className="relative w-full py-8 lg:py-12 pt-24 lg:pt-28 px-4 md:px-6 lg:px-16 overflow-hidden">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="enter"
          className="w-full flex flex-col gap-10 sm:gap-16"
        >
          <div className="flex justify-between items-end pb-6 sm:pb-8 border-b border-zinc-800">
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-9xl font-black uppercase tracking-tighter"
            >
              OUR DIRECTORY
            </motion.h1>
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
              <div className="aspect-[4/5] bg-zinc-900/40 animate-pulse border border-zinc-800/50" />
              <div className="aspect-[4/5] bg-zinc-900/40 animate-pulse border border-zinc-800/50" />
              <div className="aspect-[4/5] bg-zinc-900/40 animate-pulse border border-zinc-800/50 hidden lg:block" />
            </div>
          )}

          {!loading && projectsList.length === 0 && (
            <p className="text-zinc-500 py-12">No projects found.</p>
          )}

          {!loading && projectsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
              {projectsList.map((project, idx) => (
                <motion.div
                  variants={fadeUp}
                  initial="initial"
                  whileInView="enter"
                  viewport={{ once: true, margin: "-50px" }}
                  key={project.slug || idx}
                >
                  <ProjectCard
                    slug={project.slug}
                    title={project.title}
                    category={project.category}
                    image={project.image}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
