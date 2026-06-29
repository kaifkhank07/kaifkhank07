"use client";

import { usePathname } from "next/navigation";
import Resume from "./Resume";

export default function ResumeWrapper() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;
  if (pathname !== "/about") return null;

  return <Resume />;
}
