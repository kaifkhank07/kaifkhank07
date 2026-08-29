"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/animations/variants";
import ProjectCard from "@/components/Project/ProjectCard";

export default function Projects() {
  const [projectsList, setProjectsList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects?visibility=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          const formattedData = data.data.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            image: p.images && p.images.length > 1 ? p.images[1] : (p.images && p.images.length > 0 ? p.images[0] : "/assets/Images/regular/agency.jpg"),
          }));
          setProjectsList(formattedData);
        }
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-white pt-40 px-6 md:px-12 pb-32">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="enter"
        className="max-w-7xl mx-auto"
      >
        <motion.h1
          variants={fadeUp}
          className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-20 border-b border-zinc-800 pb-12"
        >
          OUR DIRECTORY
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
          {projectsList.map((project, idx) => (
            <motion.div variants={fadeUp} key={project.slug || idx}>
              <ProjectCard
                slug={project.slug}
                title={project.title}
                category={project.category}
                image={project.image}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
