"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: [0.77, 0, 0.175, 1], delay: 1 }}
      className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-8 md:px-12">
        <Link
          href="/"
          className=" text-sm sm:text-xl font-medium sm:font-bold tracking-widest sm:tracking-tighter uppercase relative group whitespace-nowrap"
        >
          Kaif Khan
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
        </Link>

        <nav className="flex gap-8 text-sm tracking-widest font-medium uppercase">
          {[
            { name: "Work", path: "/projects" },
            { name: "About", path: "/about" },
            { name: "Contact", path: "/contact" },
          ].map((item, idx) => (
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
      </div>
    </motion.header>
  );
}
