'use client';

import { motion } from 'framer-motion';
import { pageReveal } from '@/animations/variants';
import TransitionOverlay from '@/transitions/TransitionOverlay';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TransitionOverlay />
      <motion.div
        variants={pageReveal}
        initial="initial"
        animate="enter"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </>
  );
}
