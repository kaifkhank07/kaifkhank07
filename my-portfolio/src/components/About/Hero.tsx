"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
    const [aboutData, setAboutData] = useState({
        profileImage: "/assets/Images/regular/agency.jpg",
        story: "As a developer, I help businesses and startups transform ideas into reliable web applications. My approach combines clean architecture, modern technologies, and attention to detail to deliver solutions that are both powerful and easy to use."
    });

    useEffect(() => {
        fetch("/api/about")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setAboutData({
                        profileImage: data.data.profileImage || "/assets/Images/regular/agency.jpg",
                        story: data.data.story || aboutData.story
                    });
                }
            })
            .catch(err => console.error("Error fetching about data:", err));
    }, []);

    const words = aboutData.story.split(" ");

    const MotionImage = motion(Image);

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center py-8 lg:py-12 pt-24 lg:pt-28 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
            <div className="w-full max-w-8xl 3xl:max-w-[1450px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 xl:gap-16 items-center">
                    {/* Profile Image Column */}
                    <div className="lg:col-span-5 flex justify-center lg:justify-start">
                        <div className="group relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px] xl:max-w-[500px] aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] xl:aspect-[3/4] overflow-hidden bg-zinc-100 shadow-sm">
                            <MotionImage
                                src={aboutData.profileImage}
                                alt="Profile Image"
                                fill
                                priority
                                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
                                initial={{ scale: 1.15, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
                                className="object-cover grayscale brightness-95 contrast-105 transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:grayscale-0 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Story Text Column */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
                            className="text-xs sm:text-sm font-bold tracking-[0.25em] text-zinc-400 uppercase mb-4 sm:mb-6 lg:mb-8"
                        >
                            My Story
                        </motion.h1>

                        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] xl:text-5xl font-medium leading-[1.25] sm:leading-[1.2] tracking-tight flex flex-wrap gap-x-2 sm:gap-x-2.5 md:gap-x-3 gap-y-1 sm:gap-y-1.5">
                            {words.map((word, i) => (
                                <div key={i} className="overflow-hidden">
                                    <motion.span
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{ y: "0%", opacity: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.3 + i * 0.02,
                                            ease: [0.77, 0, 0.175, 1],
                                        }}
                                        className="inline-block"
                                    >
                                        {word}
                                    </motion.span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}