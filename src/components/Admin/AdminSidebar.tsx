"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  UserCircle,
  Map,
  Wrench,
  Share2,
  MessageSquare,
  LogOut,
  Settings
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderOpen },
  { name: "About", href: "/admin/about", icon: UserCircle },
  { name: "Journey", href: "/admin/journey", icon: Map },
  { name: "Skills", href: "/admin/skills", icon: Wrench },
  { name: "Social Links", href: "/admin/social", icon: Share2 },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Profile", href: "/admin/profile", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-black text-white flex flex-col h-screen fixed top-0 left-0 border-r border-zinc-800">
      <div className="p-6 border-b border-zinc-800">
        <Link href="/" className="text-2xl font-bold tracking-widest uppercase hover:text-white/70 transition-colors">Admin</Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? "bg-white text-black font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-900 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
