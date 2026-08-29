"use client";

import { usePathname } from "next/navigation";
import Resume from "./Resume";
import WhatsApp from "./WhatsApp";


export default function PublicComponents() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {pathname === "/about" && <Resume />}
      {pathname === "/contact" && <WhatsApp />}
    </>
  );
}