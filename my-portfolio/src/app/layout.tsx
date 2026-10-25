import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/cursor/CustomCursor";
import { Navbar } from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import SmoothScrollProvider from "@/components/Layout/SmoothScrollProvider";
import PublicComponents from "@/components/Layout/PublicComponents";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kaif Khan",
  description: "I'm a full stack developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black">
        <CustomCursor />
        <Navbar />
        {/* <ResumeWrapper /> */}
        <PublicComponents />
        <SmoothScrollProvider>
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
