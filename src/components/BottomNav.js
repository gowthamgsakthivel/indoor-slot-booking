"use client";

import Link from "next/link";
import { Home as HomeIcon, ClipboardList, Ticket, ShoppingCart, Plus } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#0c0c0e]/95 backdrop-blur-xl border-t border-white/5 z-50 flex justify-center pb-[env(safe-area-inset-bottom)]">
      <ul className="flex w-full max-w-md justify-between items-center px-6 h-20 relative">
        <li className="flex flex-col items-center gap-1.5 text-(--orange) cursor-pointer">
          <HomeIcon size={24} strokeWidth={2.5} className="drop-shadow-[0_0_8px_rgba(255,107,0,0.6)]" />
          <span className="font-bold text-[10px] tracking-wider mt-0.5">HOME</span>
        </li>
        <li>
          <Link
            href="/orders"
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors"
          >
            <ClipboardList size={22} strokeWidth={2.5} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">ORDERS</span>
          </Link>
        </li>
        <li className="relative -top-5 cursor-pointer transform hover:scale-105 transition-transform" onClick={() => window.location.href='/book'}>
          <div className="w-14 h-14 bg-(--orange) rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(255,107,0,0.5)] border-4 border-[#0c0c0e]">
            <Plus size={28} color="black" strokeWidth={3} />
          </div>
        </li>
        <li>
          <Link
            href="/member"
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors"
          >
            <Ticket size={22} strokeWidth={2.5} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">
              MEMBER
            </span>
          </Link>
        </li>
        <li>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-colors"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            <span className="font-bold text-[10px] tracking-wider mt-0.5">CART</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
