'use client';

import { motion } from 'framer-motion';
import { curtainReveal, curtainRevealSecondary } from '@/animations/variants';

export default function TransitionOverlay() {
  return (
    <>
      <motion.div
        variants={curtainReveal}
        initial="initial"
        animate="enter"
        className="fixed inset-0 z-[80] bg-zinc-900 pointer-events-none w-full h-[100vh]"
      />
      <motion.div
        variants={curtainRevealSecondary}
        initial="initial"
        animate="enter"
        className="fixed inset-0 z-[70] bg-white pointer-events-none w-full h-[100vh]"
      />
    </>
  );
}
