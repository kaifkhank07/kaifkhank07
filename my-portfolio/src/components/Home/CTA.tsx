"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/Ui/MagneticButton";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="relative min-h-[80vh] w-full py-8 lg:py-12 px-4 md:px-6 lg:px-16 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
          className="text-center"
        >
          <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-12">
            LET'S TALK
          </h2>

          <MagneticButton
            onClick={() => router.push("/contact")}
            className="px-12 py-6 text-lg tracking-widest w-64 h-24 mx-auto rounded-full"
          >
            START A PROJECT
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
