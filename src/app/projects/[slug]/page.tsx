"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring } from "framer-motion";
import ProgressIndicator from "@/components/Project/ProgressIndicator";
import ProjectHero from "@/components/Project/ProjectHero";
import ProjectDescription from "@/components/Project/ProjectDescription";
import ProjectMediaSection from "@/components/Project/ProjectMediaSection";

function ProjectContent({ project }: { project: any }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main
      ref={containerRef}
      className="relative w-full bg-white text-black min-h-[300vh]"
    >
      <ProgressIndicator scaleX={scaleX} />
      <ProjectHero project={project} />
      <ProjectDescription project={project} />
      <ProjectMediaSection images={project.images || []} />
    </main>
  );
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects?slug=${slug}&visibility=true`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setProject(data.data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white font-semibold">Loading...</div>;
  if (!project) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white font-semibold text-2xl">Project not found</div>;

  return <ProjectContent project={project} />;
}
