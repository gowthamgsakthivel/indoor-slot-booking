"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const adminName = session?.user?.name || "Admin";
  const adminImage = session?.user?.image;
  const adminInitials = adminName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-white/5 bg-[#0d0d0d] px-6 py-8">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#ff6b00] to-[#ffb347]" />
          <div>
            <p className="text-display text-sm font-extrabold tracking-[0.32em] text-(--orange)">
              NAMAKKAL
            </p>
            <p className="text-display text-xs font-bold tracking-[0.28em] text-white/85">
              SPORT CLUB
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

        <Link href="/profile" className="mt-auto rounded-2xl bg-[#141414] p-4">
          <div className="flex items-center gap-3">
            {adminImage ? (
              <Image
                alt="Admin profile"
                className="h-10 w-10 rounded-full object-cover"
                src={adminImage}
                width={40}
                height={40}
                sizes="40px"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#262626] text-sm font-semibold text-white/80">
                {adminInitials || "AD"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{adminName}</p>
              <p className="text-[10px] text-white/40">Administrator</p>
            </div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
