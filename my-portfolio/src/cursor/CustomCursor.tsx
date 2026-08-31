'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
  const pathname = usePathname();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Custom physics for lag behavior - "premium feel"
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      document.body.style.cursor = 'auto';
      return;
    }

    // Hide native cursor immediately on load if js is present
    document.body.style.cursor = 'none';
    
    // Slight delay before showing cursor to avoid flash before mouse move
    const timer = setTimeout(() => setIsVisible(true), 500);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, [data-cursor-text]') as HTMLElement;
      
      if (interactiveEl) {
        setIsHovered(true);
        // Extract text if specified (e.g. "View", "Open")
        const text = interactiveEl.getAttribute('data-cursor-text');
        if (text) {
          setHoverText(text);
        } else {
          setHoverText("");
        }
      } else {
        setIsHovered(false);
        setHoverText("");
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      clearTimeout(timer);
    };
  }, [cursorX, cursorY]);

  if (pathname.startsWith("/admin")) return null;
  if (!isVisible && typeof window !== 'undefined') return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center font-sans tracking-widest text-[9px] font-bold text-black uppercase hidden md:flex"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? (hoverText ? 64 : 48) : 40,
          height: isHovered ? (hoverText ? 64 : 48) : 40,
          scale: isHovered ? 1 : 1,
          backgroundColor: isHovered ? '#ffffff' : 'transparent',
          mixBlendMode: isHovered ? 'normal' : 'difference',
        }}
        transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered && hoverText ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="whitespace-nowrap"
        >
          {hoverText}
        </motion.span>
      </motion.div>
    </>
  );
}
