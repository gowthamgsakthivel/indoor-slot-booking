"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Home as HomeIcon, ClipboardList, Ticket, ShoppingCart, Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const showNav = useSyncExternalStore(
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
      if (pathname !== "/") {
        return true;
      }
      return Boolean(sessionStorage.getItem("hasSeenIntro"));
    },
    () => false
  );
  const isActive = (href) => pathname === href;

  if (!showNav) {
    return null;
  }

  const navClass = (href) =>
    `flex flex-col items-center gap-1.5 transition-colors ${
      isActive(href)
        ? "text-(--orange)"
        : "text-white/40 hover:text-white"
    }`;
  const iconClass = (href) =>
    isActive(href) ? "drop-shadow-[0_0_8px_rgba(255,107,0,0.6)]" : "";

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#0c0c0e]/95 backdrop-blur-xl border-t border-white/5 z-50 flex justify-center pb-[env(safe-area-inset-bottom)]">
      <ul className="flex w-full max-w-md justify-between items-center px-6 h-[var(--app-nav-height)] relative">
        <li>
          <Link href="/" className={navClass("/")}
            aria-current={isActive("/") ? "page" : undefined}
          >
            <HomeIcon size={24} strokeWidth={2.5} className={iconClass("/")} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">HOME</span>
          </Link>
        </li>
        <li>
          <Link
            href="/orders"
            className={navClass("/orders")}
            aria-current={isActive("/orders") ? "page" : undefined}
          >
            <ClipboardList size={22} strokeWidth={2.5} className={iconClass("/orders")} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">ORDERS</span>
          </Link>
        </li>
        <li className="relative -top-5">
          <Link
            href="/book"
            className="block transform hover:scale-105 transition-transform"
            aria-label="Book a court"
          >
            <div className="w-14 h-14 bg-(--orange) rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(255,107,0,0.5)] border-4 border-[#0c0c0e]">
              <Plus size={28} color="black" strokeWidth={3} />
            </div>
          </Link>
        </li>
        <li>
          <Link
            href="/member"
            className={navClass("/member")}
            aria-current={isActive("/member") ? "page" : undefined}
          >
            <Ticket size={22} strokeWidth={2.5} className={iconClass("/member")} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">
              MEMBER
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/cart"
            className={navClass("/cart")}
            aria-current={isActive("/cart") ? "page" : undefined}
          >
            <ShoppingCart size={22} strokeWidth={2.5} className={iconClass("/cart")} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">CART</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
