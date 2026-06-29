'use client';

import { motion, MotionValue } from 'framer-motion';

interface ProgressIndicatorProps {
  scaleX: MotionValue<number>;
}

export default function ProgressIndicator({
  scaleX,
}: ProgressIndicatorProps) {
  return (
    <div className="fixed left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-zinc-200 z-50 ml-2 hidden md:block">
      <motion.div
        className="w-full bg-black origin-top"
        style={{
          scaleY: scaleX,
          height: '100%',
        }}
      />
    </div>
  );
}