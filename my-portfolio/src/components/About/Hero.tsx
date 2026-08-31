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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 max-w-7xl mx-auto items-center min-h-[70vh]">
            <div className="group relative w-full aspect-[3/4] md:w-[80%] mx-auto overflow-hidden">
                <MotionImage
                    src={aboutData.profileImage}
                    alt="Profile Image"
                    fill
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: [0.77, 0, 0.175, 1] }}
                    className="object-cover grayscale brightness-90 contrast-110 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col justify-center">
                <h1 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-8">
                    My Story
                </h1>

                <div className="text-3xl md:text-5xl font-medium leading-[1.2] flex flex-wrap gap-x-3 gap-y-2">
                    {words.map((word, i) => (
                        <div key={i} className="overflow-hidden">
                            <motion.span
                                initial={{ y: "100%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 1 }}
                                transition={{
                                    duration: 0.8,
                                    delay: 0.6 + i * 0.05,
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
    );
}