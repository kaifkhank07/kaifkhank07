"use client";

import { motion } from "framer-motion";

interface ProjectDescriptionProps {
  project: any;
}

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <section className="py-32 px-6 md:px-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          duration: 1,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-16"
      >
        <div>
          <h2 className="text-3xl font-bold mb-8 uppercase">About Project</h2>

          <p className="text-xl leading-relaxed text-zinc-600 whitespace-pre-wrap">
            {project.challengeDescription || "Project description goes here."}
          </p>
        </div>

        <div className="flex flex-col gap-8 md:pl-12 border-l border-zinc-200">
          <div>
            <span className="block text-sm font-bold text-zinc-400">
              CLIENT
            </span>
            <span className="text-lg font-medium">
              {project.clientName}
            </span>
          </div>

          <div>
            <span className="block text-sm font-bold text-zinc-400">
              SERVICES
            </span>
            <div className="flex flex-wrap gap-1">
              {project.services?.map((service: any, idx: number) => (
                <div key={idx} className="text-lg font-medium">
                  <span>{service}</span>
                  {idx < project.services.length - 1 && (
                    <span className="text-zinc-400"> / </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="block text-sm font-bold text-zinc-400">LIVE</span>
            <a
              href={project.liveDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              View Live Site
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
