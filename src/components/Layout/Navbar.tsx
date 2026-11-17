"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { EASING } from "@/animations/variants";

interface SocialLink {
  name: string;
  href: string;
}

const defaultSocials: SocialLink[] = [
  { name: "Instagram", href: "https://www.instagram.com/kaifkhank07" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/kaifkhank07" },
  { name: "WhatsApp", href: "https://wa.me/917028469345" },
  { name: "GitHub", href: "https://github.com/kaifkhank07" },
];

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// Seamless full-width shutter animations (no column splits, no gaps, no lines)
const shutterCurtainVariants = {
  initial: { y: "-100%" },
  open: {
    y: "0%",
    transition: {
      duration: 0.7,
      ease: EASING,
    },
  },
  exit: {
    y: "-100%",
    transition: {
      duration: 0.55,
      ease: EASING,
      delay: 0.08,
    },
  },
};

const secondaryCurtainVariants = {
  initial: { y: "-100%" },
  open: {
    y: "0%",
    transition: {
      duration: 0.7,
      ease: EASING,
      delay: 0.05,
    },
  },
  exit: {
    y: "-100%",
    transition: {
      duration: 0.5,
      ease: EASING,
    },
  },
};

const contentVariants = {
  initial: { opacity: 0 },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.25,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const linkItemVariants = {
  initial: { y: "100%", opacity: 0 },
  open: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASING,
    },
  },
  exit: {
    y: "60%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: EASING,
    },
  },
};

const footerVariants = {
  initial: { opacity: 0, y: 15 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASING,
      delay: 0.35,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>("");
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile shutter on route change during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when shutter is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Live IST time (matching Footer)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        }) + " IST"
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch socials (matching Footer)
  useEffect(() => {
    let isMounted = true;
    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.data && data.data.length > 0) {
          const fetchedSocials = data.data.map(
            (s: { platform?: string; link?: string; name?: string; href?: string }) => ({
              name: s.platform || s.name || "",
              href: s.link || s.href || "#",
            })
          );
          setSocials(fetchedSocials);
        }
      })
      .catch((err) => console.error("Error fetching socials in Navbar:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: EASING, delay: 1 }}
        className="fixed top-0 left-0 w-full z-50 mix-blend-difference py-6 md:py-8 px-4 md:px-6 lg:px-16"
      >
        <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-sm sm:text-xl font-medium sm:font-bold tracking-widest sm:tracking-tighter uppercase relative group whitespace-nowrap"
          >
            Kaif Khan
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-sm tracking-widest font-medium uppercase">
            {NAV_ITEMS.filter((item) => item.path !== "/").map((item, idx) => (
              <Link
                key={idx}
                href={item.path}
                className="relative group overflow-hidden"
              >
                <div className="transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full">
                  {item.name}
                </div>
                <div className="absolute top-full left-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full">
                  {item.name}
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile Shutter Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-white focus:outline-none p-1.5 -mr-1.5 cursor-pointer"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            <span className="text-[11px] font-semibold tracking-widest">
              {isOpen ? "CLOSE" : "MENU"}
            </span>
            <div className="relative w-5 h-3 flex flex-col justify-between">
              <span
                className={`block w-full h-[1.5px] bg-white transition-all duration-300 origin-center ${
                  isOpen ? "rotate-45 translate-y-[5.25px]" : ""
                }`}
              />
              <span
                className={`block w-full h-[1.5px] bg-white transition-all duration-300 origin-center ${
                  isOpen ? "-rotate-45 -translate-y-[5.25px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </motion.header>

      {/* Mobile Shutter Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 md:hidden overflow-hidden">
            {/* Layer 1: Leading shutter accent curtain (seamless full-width, no gaps) */}
            <motion.div
              variants={shutterCurtainVariants}
              initial="initial"
              animate="open"
              exit="exit"
              className="absolute inset-0 bg-zinc-800 pointer-events-none"
            />

            {/* Layer 2: Main shutter panel (solid seamless dark curtain, no gaps or stripes) */}
            <motion.div
              variants={secondaryCurtainVariants}
              initial="initial"
              animate="open"
              exit="exit"
              className="absolute inset-0 bg-[#09090b] border-b border-zinc-800 shadow-2xl"
            >
              {/* Shutter Content */}
              <div className="relative z-10 flex flex-col justify-between h-full pt-24 pb-6 px-6 sm:px-8 overflow-y-auto">
                {/* Status Indicator (from Footer) */}
                <motion.div
                  variants={linkItemVariants}
                  initial="initial"
                  animate="open"
                  exit="exit"
                  className="flex items-center gap-2 pt-2"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                    Available for Projects
                  </span>
                </motion.div>

                {/* Navigation Links */}
                <motion.nav
                  variants={contentVariants}
                  initial="initial"
                  animate="open"
                  exit="exit"
                  className="flex flex-col gap-2.5 sm:gap-3 my-auto py-4"
                >
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = pathname === item.path;
                    return (
                      <div key={item.path} className="overflow-hidden">
                        <motion.div variants={linkItemVariants}>
                          <Link
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className="group flex items-baseline justify-between py-2 border-b border-zinc-800/40"
                          >
                            <div className="flex items-baseline gap-4">
                              <span className="text-xs text-zinc-500 font-mono">
                                0{idx + 1}
                              </span>
                              <span
                                className={`text-3xl sm:text-4xl font-black uppercase tracking-tight transition-colors duration-300 ${
                                  isActive
                                    ? "text-white"
                                    : "text-zinc-400 group-hover:text-white"
                                }`}
                              >
                                {item.name}
                              </span>
                            </div>
                            <span
                              className={`text-sm uppercase tracking-widest transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                                isActive
                                  ? "text-white"
                                  : "text-zinc-600 group-hover:text-white"
                              }`}
                            >
                              ↗
                            </span>
                          </Link>
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.nav>

                {/* Shutter Bottom: Connect / Contact Me & Location (matching Footer) */}
                <motion.div
                  variants={footerVariants}
                  initial="initial"
                  animate="open"
                  exit="exit"
                  className="pt-4 border-t border-zinc-800/80 flex flex-col gap-4 text-xs font-mono"
                >
                  {/* Connect / Social Links Grid (matching Footer's Connect section) */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                      Connect
                    </span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {socials.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors py-1 border-b border-zinc-900 hover:border-zinc-700"
                        >
                          <span className="transition-transform duration-300 group-hover:translate-x-1">
                            {social.name}
                          </span>
                          <span className="text-zinc-600 group-hover:text-white transition-transform duration-300">
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Location & Time (matching Footer) */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-zinc-900 text-zinc-400">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                        Location
                      </span>
                      <span className="text-zinc-300">
                        Aurangabad, Maharashtra, India
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
                        Local Time
                      </span>
                      <span className="text-zinc-400 font-mono">
                        {time || "UTC+5:30"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
