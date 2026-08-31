"use client";

import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import Hero from "@/components/Home/Hero";
import FeaturedWork from "@/components/Home/FeaturedWork";
import About from "@/components/Home/About";
import CTA from "@/components/Home/CTA";

export default function Home() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="relative w-full text-white bg-black">
      <Hero y={y} opacity={opacity} />
      <FeaturedWork />
      <About />
      <CTA />
    </main>
  );
}
