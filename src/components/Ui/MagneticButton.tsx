'use client';

import React, { useRef, useState } from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
}

export function MagneticButton({
  children,
  className,
  magneticStrength = 0.2,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={twMerge(
        clsx(
          "relative flex items-center justify-center rounded-full bg-white text-black font-semibold overflow-hidden group hover:scale-[1.05] transition-transform duration-300",
          className
        )
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-black scale-0 rounded-full group-hover:scale-100 transition-transform duration-500 origin-center ease-[cubic-bezier(0.77,0,0.175,1)]" />
      <span className="relative z-10 group-hover:text-white transition-colors duration-500">
        {children}
      </span>
    </motion.button>
  );
}
