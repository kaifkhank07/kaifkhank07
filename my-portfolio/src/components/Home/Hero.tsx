"use client";

import { useState, useEffect } from "react";
import { motion, MotionValue } from "framer-motion";
import { textReveal } from "@/animations/variants";

interface HeroSectionProps {
  y: MotionValue<string>;
  opacity: MotionValue<number>;
}

export default function Hero({ y, opacity }: HeroSectionProps) {
  const titleWords = ["FULL STACK", "DEVELOPER"];

  const [aboutData, setAboutData] = useState({
    name: "I'M A",
    story: "I build modern, scalable web applications that help businesses launch faster, grow efficiently, and deliver exceptional user experiences."
  });

  useEffect(() => {
    fetch("/api/about")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAboutData(prev => ({
            ...prev,
            story: data.data.story || prev.story
          }));
        }
      })
      .catch(err => console.error("Error fetching about data:", err));
  }, []);

  return (
    <section className="w-full h-screen flex items-center justify-center py-8 lg:py-12 lg:pt-28 px-4 md:px-6 lg:px-16 overflow-hidden">
      <div className="relative max-w-8xl 3xl:max-w-[1450px] mx-auto space-y-4">
        <motion.div
          style={{ y, opacity }}
          className="w-full flex flex-col items-center justify-center text-center z-10"
        >
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-zinc-500">
            I'M A
          </p>

          {titleWords.map((word, i) => (
            <div key={i} className="overflow-hidden px-2">
              <motion.h1
                variants={textReveal}
                custom={i}
                initial="initial"
                animate="enter"
                className="text-[12vw] 3xl:text-[10vw] leading-[0.85] font-black uppercase tracking-tighter"
              >
                {word}
              </motion.h1>
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-10 space-y-4"
          >
            <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              {aboutData.story}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="w-full flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Scroll Down
          </span>

          <div className="w-[1px] h-10 bg-zinc-800 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="absolute inset-0 w-full h-full bg-white"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
