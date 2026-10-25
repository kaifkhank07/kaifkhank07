"use client";

import { useState, useEffect } from "react";
import { skills as defaultSkills } from "./data";

export default function Skills() {
    const [skillsData, setSkillsData] = useState(defaultSkills);

    useEffect(() => {
        fetch("/api/skills")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data && data.data.length > 0) {
                    setSkillsData(data.data);
                }
            })
            .catch(err => console.error("Error fetching skills data:", err));
    }, []);

    return (
        <section className="relative w-full py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
            <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full flex flex-col gap-10 sm:gap-16">

                <div className="flex flex-col justify-between pb-6 sm:pb-8 border-b border-zinc-200">
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Stack
                    </span>

                    <h2 className="mt-4 text-6xl md:text-8xl font-bold">
                        What I Work With
                    </h2>
                </div>

                <div className="w-full grid md:grid-cols-2 gap-px bg-zinc-200">
                    {skillsData.map((group) => (
                        <div
                            key={group.category}
                            className="bg-white p-8 md:p-12 transition-all duration-500 hover:bg-black hover:text-white group"
                        >
                            <h3 className="text-2xl md:text-3xl font-semibold mb-8">
                                {group.category}
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {group.items.map((skill) => (
                                    <span
                                        key={skill}
                                        className="text-sm uppercase tracking-wider text-zinc-500 group-hover:text-zinc-300 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}