"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsApp() {
    const PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const DEFAULT_MESSAGE = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "";

    // console.log("phone :", PHONE_NUMBER);
    // console.log("message :", DEFAULT_MESSAGE);

    const openChat = () => {
        const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
            DEFAULT_MESSAGE
        )}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <motion.button
            onClick={openChat}
            animate={{
                y: [-12, 0, -12],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className="fixed bottom-6 md:bottom-12 right-6 md:right-12 z-50 bg-[#01C501] text-white p-3 rounded-full shadow-lg cursor-pointer hover:opacity-80 transition-opacity duration-300"
            aria-label="WhatsApp"
        >
            <Image
                src="/assets/Images/regular/whatsapp-icon.png"
                alt="WhatsApp Icon"
                width={30}
                height={30}
            />
        </motion.button>
    );
}