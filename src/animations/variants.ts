export const EASING = [0.77, 0, 0.175, 1] as const; // "Buttery" curve

export const pageReveal = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1, 
    transition: { duration: 0.8, ease: EASING } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.5, ease: EASING } 
  }
};

export const curtainReveal = {
  initial: { top: 0 },
  enter: { 
    top: "-100vh", 
    transition: { duration: 1.2, ease: EASING, delay: 0.2 } 
  }
};

export const curtainRevealSecondary = {
  initial: { top: 0 },
  enter: { 
    top: "-100vh", 
    transition: { duration: 1.2, ease: EASING, delay: 0.3 } 
  }
};

export const textReveal = {
  initial: { y: "120%", rotate: 5, opacity: 0 },
  enter: (i = 0) => ({
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 1, ease: EASING, delay: 0.1 * i }
  })
};

export const fadeUp = {
  initial: { y: 40, opacity: 0 },
  enter: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: EASING }
  }
};

export const staggerContainer = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};
