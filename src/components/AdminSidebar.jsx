"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Calendar,
  Group,
  Users,
  Command,
  LineChart,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, href: "/admin" },
  { label: "Courts", icon: Calendar, href: "/admin/courts" },
  { label: "Groups", icon: Group, href: "/admin/groups" },
  { label: "Members", icon: Users, href: "/admin/members" },
  { label: "Bookings", icon: Command, href: "/admin/bookings" },
  { label: "Payments", icon: LineChart, href: "/admin/payments" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/5 bg-[#0d0d0d] px-6 py-8">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#ff6b00] to-[#ffb347]" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]">Kinetic Onyx</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Elite Sports Club
            </p>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-2 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-[#1a1a1a] text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                    : "text-white/50 hover:text-white"
                }`}
                href={item.href}
              >
                <Icon size={18} />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#141414] p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#262626]" />
            <div>
              <p className="text-sm font-semibold">Admin Console</p>
              <p className="text-[10px] text-white/40">System Root</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
