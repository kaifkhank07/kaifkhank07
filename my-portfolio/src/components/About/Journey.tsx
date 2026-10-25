"use client";

import { useState, useEffect } from "react";
import { journey as defaultJourney } from "./data";

export default function Journey() {
    const [journeyData, setJourneyData] = useState(defaultJourney);

    useEffect(() => {
        fetch("/api/journey")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data && data.data.length > 0) {
                    setJourneyData(data.data.map((item: any) => ({
                        ...item,
                        period: item.completedDate ? `${item.joinedDate} - ${item.completedDate}` : `${item.joinedDate} - Present`
                    })));
                }
            })
            .catch(err => console.error("Error fetching journey data:", err));
    }, []);

    return (
        <section className="relative w-full py-8 lg:py-12 px-4 md:px-6 lg:px-16 overflow-hidden bg-white text-black">
            <div className="max-w-8xl 3xl:max-w-[1450px] mx-auto w-full flex flex-col gap-10 sm:gap-16">
                <div className="flex flex-col justify-between pb-6 sm:pb-8 border-b border-zinc-200">
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                        Journey
                    </span>

                    <h2 className="mt-4 text-6xl md:text-8xl font-bold">
                        Experience & Education
                    </h2>
                </div>

                <div className="">
                    {journeyData.map((item: any, index: number) => (
                        <div
                            key={item._id || index}
                            className="group border-b border-zinc-200 py-10 transition-all duration-500 hover:pl-8"
                        >
                            <div className="grid md:grid-cols-[200px_1fr_120px] gap-8 items-start">
                                <span className="text-zinc-500">{item.period || item.joinedDate}</span>

                                <div>
                                    <span className="text-xs uppercase tracking-wider text-zinc-400">
                                        {item.type}
                                    </span>

                                    <h3 className="mt-2 text-3xl md:text-4xl font-semibold">
                                        {item.title}
                                    </h3>

                                    {item.at && (item.at.name || item.at.url) && (
                                        <div className="mt-2 text-sm text-zinc-500 font-medium">
                                            at{" "}
                                            {item.at.name ? (
                                                item.at.url ? (
                                                    <a
                                                        href={item.at.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold"
                                                    >
                                                        {item.at.name}
                                                    </a>
                                                ) : (
                                                    <span className="font-semibold text-zinc-700">{item.at.name}</span>
                                                )
                                            ) : (
                                                <a
                                                    href={item.at.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline font-semibold"
                                                >
                                                    {item.at.url}
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <p className="mt-4 text-zinc-600 max-w-2xl">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="text-right text-zinc-300 group-hover:text-black transition-colors">
                                    0{index + 1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}