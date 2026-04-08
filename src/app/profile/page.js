"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronRight,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 pb-6 pt-4">
        <header className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70"
            aria-label="Back home"
          >
            <ChevronRight size={18} className="rotate-180" />
          </Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              Profile
            </p>
            <h1 className="text-display mt-2 text-3xl font-black">Your Account</h1>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-(--orange)/30 bg-[#1c140d] text-(--orange) shadow-[0_0_18px_rgba(255,107,0,0.2)]">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={64}
                  height={64}
                  sizes="64px"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User size={24} strokeWidth={2.5} />
                </div>
              )}
            </div>
            <div>
              <p className="text-lg font-semibold">
                {session?.user?.name || "Member"}
              </p>
              <p className="text-xs text-white/60">
                {session?.user?.email || "Signed in"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Account management
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <button className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1c140d] p-2 text-(--orange)">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Payment methods</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Manage cards
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </button>

            <Link
              href="/orders"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-4 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1c140d] p-2 text-(--orange)">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">My bookings</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Order history
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            System
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <button className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1c140d] p-2 text-(--orange)">
                  <Settings size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Settings</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Preferences
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </button>

            <button className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-4 text-left cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#1c140d] p-2 text-(--orange)">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Help center</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Support
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </button>

            <button
              className="flex items-center justify-between rounded-2xl border border-[#2b1a1a] bg-[#1a0f0f] px-4 py-4 text-left text-[#ff7b72] cursor-pointer"
              onClick={() => setShowLogoutConfirm(true)}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#2b1a1a] p-2 text-[#ff7b72]">
                  <LogOut size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Logout</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffb199]">
                    Sign out
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#ff7b72]" />
            </button>
          </div>
        </section>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Sign out</p>
            <h2 className="text-display mt-3 text-2xl font-semibold text-white">
              Log out of your account?
            </h2>
            <p className="mt-3 text-sm text-white/60">
              You can sign in again anytime.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 rounded-full bg-(--orange) px-4 py-3 text-sm font-semibold text-black"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
