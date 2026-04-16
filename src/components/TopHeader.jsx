"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function TopHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/book", label: "Book" },
    { href: "/orders", label: "Orders" },
    { href: "/member", label: "Member" },
    { href: "/cart", label: "Cart" },
  ];
  const showHeader = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }
      window.addEventListener("introchange", callback);
      window.addEventListener("storage", callback);
      return () => {
        window.removeEventListener("introchange", callback);
        window.removeEventListener("storage", callback);
      };
    },
    () => {
      if (typeof window === "undefined") {
        return false;
      }
      if (pathname.startsWith("/admin")) {
        return false;
      }
      if (pathname !== "/") {
        return true;
      }
      return Boolean(sessionStorage.getItem("hasSeenIntro"));
    },
    () => false
  );

  if (pathname.startsWith("/admin")) {
    return null;
  }

  if (!showHeader) {
    return null;
  }

  const profileHref = session?.user ? "/profile" : "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0c0c0e]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 xl:max-w-6xl xl:px-10">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-display text-sm font-extrabold tracking-[0.32em] text-(--orange)">
            NAMAKKAL
          </span>
          <span className="text-display text-xs font-bold tracking-[0.28em] text-white/85">
            SPORT CLUB
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs font-semibold uppercase tracking-[0.22em] transition-colors ${
                  isActive ? "text-(--orange)" : "text-white/50 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-full border border-(--orange)/40 bg-(--orange)/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-(--orange)"
            >
              Admin
            </Link>
          )}
          {!session?.user && (
            <button
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white"
              onClick={() => signIn("google", { callbackUrl: "/" })}
            >
              Sign in
            </button>
          )}
          <Link
            href={profileHref}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--orange)/20 bg-[#1c140d] text-(--orange) shadow-[0_0_15px_rgba(255,107,0,0.15)]"
            aria-label="Profile"
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                sizes="40px"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User size={18} strokeWidth={2.5} />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
