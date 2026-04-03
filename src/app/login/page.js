"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <div className="min-h-screen bg-(--background) text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0c0c0e] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Secure access
          </p>
          <h1 className="text-display text-3xl font-black mt-2">
            Sign in to NKL
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Use your Google account to access bookings and admin tools.
          </p>
        </div>

        {session?.user ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-white/70">Signed in as</p>
              <p className="text-sm font-semibold">
                {session.user.email || session.user.name}
              </p>
              <p className="text-xs text-white/50">
                Role: {session.user.role || "user"}
              </p>
            </div>
            <button
              className="w-full rounded-full bg-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/20 transition-colors"
              onClick={() => signOut({ callbackUrl: "/" })}
              disabled={isLoading}
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            className="w-full rounded-full bg-(--orange) px-5 py-3 text-sm font-bold text-black shadow-[0_12px_30px_rgba(255,107,0,0.35)] hover:scale-[1.01] transition-transform"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            disabled={isLoading}
          >
            Continue with Google
          </button>
        )}

        <div className="mt-6 text-center">
          <Link className="text-xs text-white/50 hover:text-white" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
