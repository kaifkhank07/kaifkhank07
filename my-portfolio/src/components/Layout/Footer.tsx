"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Footer() {
  const pathname = usePathname();
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Live Indian Standard Time (IST) display
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

  useEffect(() => {
    let isMounted = true;
    fetch("/api/socials")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data.success && data.data && data.data.length > 0) {
          const fetchedSocials = data.data.map((s: any) => ({
            name: s.platform,
            href: s.link,
          }));
          setSocials(fetchedSocials);
        }
      })
      .catch((err) => console.error("Error fetching socials:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Hide footer on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="relative w-full border-t border-zinc-900 py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden">
      <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full flex flex-col gap-16 lg:gap-24">
        {/* Top Grid: Status, Quick Navigation, Socials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Status & Location (Cols 1-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                Available for Projects
              </span>
            </div>

            <p className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-200 max-w-md leading-snug">
              Have an idea? Let's turn it into a remarkable digital product.
            </p>

            <div className="text-xs uppercase tracking-widest text-zinc-500 flex flex-col sm:flex-row gap-2 sm:gap-6 mt-2">
              <span>Aurangabad, Maharashtra, India</span>
              <span className="hidden sm:inline">•</span>
              <span>{time || "UTC+5:30"}</span>
            </div>
          </div>

          {/* Navigation Links (Cols 6-8) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">
              Navigation
            </span>
            {[
              { name: "Home", path: "/" },
              { name: "Work", path: "/projects" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className="relative group overflow-hidden w-fit text-sm uppercase tracking-widest font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <div className="transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full">
                  {link.name}
                </div>
                <div className="absolute top-full left-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full">
                  {link.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Socials / Online (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">
              Connect
            </span>
            <div className="flex flex-col gap-3">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between text-sm uppercase tracking-widest text-zinc-400 hover:text-white transition-colors py-1 border-b border-zinc-900 hover:border-zinc-700"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    {social.name}
                  </span>
                  <span className="text-zinc-600 group-hover:text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Large Signature Typographic Header */}
        {/* <div className="border-t border-zinc-900 pt-12 lg:pt-16 overflow-hidden select-none">
          <h2 className="text-[13vw] leading-[0.8] font-black uppercase tracking-tighter text-zinc-900 hover:text-zinc-800 transition-colors duration-700 text-center whitespace-nowrap">
            KAIF KHAN
          </h2>
        </div> */}

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-900 pt-8 text-xs text-zinc-500 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Kaif Khan. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
