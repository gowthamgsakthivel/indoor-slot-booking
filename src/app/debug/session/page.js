"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-(--background) text-white px-6 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-display text-2xl font-black">Session Debug</h1>
          <Link
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
            href="/"
          >
            Back home
          </Link>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Status
          </p>
          <p className="mt-2 text-sm font-semibold">{status}</p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Session
          </p>
          <pre className="mt-4 overflow-x-auto text-xs text-white/70">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
