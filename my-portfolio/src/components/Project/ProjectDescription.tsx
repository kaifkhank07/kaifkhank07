"use client";

import { motion } from "framer-motion";

interface ProjectDescriptionProps {
  project: any;
}

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  return (
    <section className="relative w-full py-8 lg:py-12 lg:pt-20 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 1,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          <div className="lg:col-span-7">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 uppercase tracking-tight">
              About Project
            </h2>

            <p className="text-lg sm:text-xl leading-relaxed text-zinc-600 font-normal">
              {project.challengeDescription || "Project description goes here."}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8 lg:pl-12 border-t lg:border-t-0 lg:border-l border-zinc-200 pt-8 lg:pt-0">
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
                CLIENT
              </span>
              <span className="text-lg font-medium text-zinc-900">
                {project.clientName || "N/A"}
              </span>
            </div>

            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
                SERVICES
              </span>
              <div className="flex flex-wrap gap-1">
                {project.services?.map((service: any, idx: number) => (
                  <div key={idx} className="text-lg font-medium text-zinc-900">
                    <span>{service}</span>
                    {idx < project.services.length - 1 && (
                      <span className="text-zinc-400"> / </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {project.liveDemoLink && (
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">
                  LIVE
                </span>
                <a
                  href={project.liveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-black hover:text-zinc-600 underline underline-offset-4 transition-colors duration-300"
                >
                  View Live Site &rarr;
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
