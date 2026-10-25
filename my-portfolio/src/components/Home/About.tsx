"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="relative min-h-[80vh] w-full flex items-center py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
        >
          <h2 className="text-4xl md:text-7xl lg:text-[6rem] font-bold leading-tight tracking-tighter">
            I BUILD DIGITAL PRODUCTS THAT DRIVE RESULTS. NOT JUST WEBSITES.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
