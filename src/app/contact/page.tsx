"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/Ui/MagneticButton";
import { fadeUp } from "@/animations/variants";

const defaultSocials = [
  {
    name: "GitHub",
    username: "@kaifkhank07",
    href: "#",
  },
  {
    name: "LinkedIn",
    username: "/in/kaifkhank07",
    href: "#",
  },
  {
    name: "Instagram",
    username: "@kaifkhank07",
    href: "#",
  },
  {
    name: "WhatsApp",
    username: "7028469345",
    href: "#",
  },
];

export default function Contact() {
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [socials, setSocials] = useState(defaultSocials);

  useEffect(() => {
    fetch("/api/socials")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          setSocials(data.data.map((s: any) => ({
            name: s.platform,
            username: s.username,
            href: s.link
          })));
        }
      })
      .catch(err => console.error("Error fetching socials:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      number: formData.get("number"),
      message: formData.get("message")
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch (err) {
      console.error(err);
      setFormState("error");
    }
  };

  return (
    <main className="min-h-screen w-full bg-black text-white pt-40 pb-20 px-6 md:px-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl border-l border-zinc-800 pl-8 md:pl-16 relative">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16"
        >
          START A<br /> PROJECT
        </motion.h1>

        <AnimatePresence mode="wait">
          {formState === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20"
            >
              <h2 className="text-4xl font-bold mb-4">Request Received.</h2>
              <p className="text-zinc-400 text-xl">
                We'll be in touch shortly.
              </p>
            </motion.div>
          ) : formState === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20"
            >
              <h2 className="text-4xl font-bold mb-4 text-red-500">Error Occurred.</h2>
              <p className="text-zinc-400 text-xl">
                Please try again later.
              </p>
              <button 
                onClick={() => setFormState("idle")}
                className="mt-8 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-sm"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              variants={fadeUp}
              initial="initial"
              animate="enter"
              exit={{ opacity: 0, y: -50 }}
              className="flex flex-col gap-12 w-full"
              onSubmit={handleSubmit}
            >
              {/* Input Group */}
              <div className="relative group w-full">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl focus:outline-none focus:border-white peer placeholder-transparent"
                  placeholder="Name"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 top-4 text-zinc-600 text-xl transition-all duration-300 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-xs peer-valid:text-zinc-400 uppercase font-bold tracking-widest pointer-events-none"
                >
                  What's your name?
                </label>
              </div>

              <div className="relative group w-full">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl focus:outline-none focus:border-white peer placeholder-transparent"
                  placeholder="Email"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 top-4 text-zinc-600 text-xl transition-all duration-300 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-xs peer-valid:text-zinc-400 uppercase font-bold tracking-widest pointer-events-none"
                >
                  Your email address?
                </label>
              </div>

              <div className="relative group w-full">
                <input
                  type="text"
                  id="number"
                  name="number"
                  required
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl focus:outline-none focus:border-white peer placeholder-transparent"
                  placeholder="Number"
                />
                <label
                  htmlFor="number"
                  className="absolute left-0 top-4 text-zinc-600 text-xl transition-all duration-300 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-xs peer-valid:text-zinc-400 uppercase font-bold tracking-widest pointer-events-none"
                >
                  Your phone number?
                </label>
              </div>

              <div className="relative group w-full">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={1}
                  className="w-full bg-transparent border-b border-zinc-800 py-4 text-xl resize-none focus:outline-none focus:border-white peer placeholder-transparent"
                  placeholder="Message"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-4 text-zinc-600 text-xl transition-all duration-300 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-zinc-400 peer-valid:-top-6 peer-valid:text-xs peer-valid:text-zinc-400 uppercase font-bold tracking-widest pointer-events-none"
                >
                  Tell us about your project
                </label>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <p className="text-zinc-500 text-sm hidden md:block">
                  Based in NYC. Working Globally.
                </p>
                <MagneticButton
                  type="submit"
                  className="w-full md:w-64 h-20 text-lg group bg-white text-black"
                  disabled={formState === "submitting"}
                >
                  {formState === "submitting" ? "SENDING..." : "SEND MESSAGE"}
                </MagneticButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 border-t border-zinc-800 pt-10"
        >
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-16"
          >
            FIND ME
            <br /> ONLINE
          </motion.h1>

          <div className="mt-8">
            {socials.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-center justify-between py-6 border-b border-zinc-900 "
              >
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold transition-transform duration-500 group-hover:translate-x-4">
                    {social.name}
                  </h3>

                  <p className="text-zinc-500 mt-1">{social.username}</p>
                </div>

                <div className="text-3xl text-zinc-700 transition-all duration-500 group-hover:text-white group-hover:translate-x-2 group-hover:-translate-y-2">
                  ↗
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
