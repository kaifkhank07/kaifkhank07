"use client";

import Hero from "@/components/About/Hero";
import Journey from "@/components/About/Journey";
import Skills from "@/components/About/Skills";

export default function About() {
  return (
    <>
      <main className="relative min-h-screen w-full bg-white text-black pt-40 pb-20 px-6 md:px-12">
        <Hero />

        <div className="mt-20 space-y-20">
          <Journey />
          <Skills />
        </div>
      </main>
    </>
  );
}
