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
        <section>
            <div className="mb-10">
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Journey
                </span>

                <h2 className="mt-4 text-6xl md:text-8xl font-bold">
                    Experience & Education
                </h2>
            </div>

            <div className="border-t border-zinc-200">
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
        </section>
    );
}