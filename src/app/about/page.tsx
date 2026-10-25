"use client";

import Hero from "@/components/About/Hero";
import Journey from "@/components/About/Journey";
import Skills from "@/components/About/Skills";

export default function About() {
  return (
    <>
      <main className="relative w-full">
        <Hero />
        <Journey />
        <Skills />
      </main>
    </>
  );
}
