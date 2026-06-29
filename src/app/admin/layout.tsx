"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-zinc-50 text-black flex font-sans">
      {!isLoginPage && <AdminSidebar />}
      <div className={`flex-1 flex flex-col ${!isLoginPage ? 'ml-64' : ''}`}>
        {!isLoginPage && (
          <header className="bg-white border-b border-zinc-200 px-8 py-6 sticky top-0 z-10">
            <h1 className="text-2xl font-bold capitalize">
              {pathname.split("/").pop() || "Dashboard"}
            </h1>
          </header>
        )}
        <main className={`flex-1 ${!isLoginPage ? 'p-8' : ''}`}>
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
