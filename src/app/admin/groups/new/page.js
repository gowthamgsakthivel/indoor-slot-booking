import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function AdminCreateGroupPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="admin-bg admin-grid min-h-screen px-6 py-10">
      <main className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-2 text-xs font-semibold text-white/70"
            href="/admin"
          >
            <ChevronLeft size={14} />
            Back to admin
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Nextgen system
          </span>
        </div>

        <div className="admin-panel-strong rounded-3xl p-6">
          <h1 className="text-2xl font-black">Create new squad</h1>
          <p className="admin-muted mt-2 text-sm">
            Configure a new group slot for courts and athlete members.
          </p>

          <div className="mt-8 grid gap-4">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Select court
              <div className="mt-2 rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm">
                Court 1 - Professional Hardwood
              </div>
            </label>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Time slot
              <div className="mt-2 rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm">
                06:00 AM - 07:00 AM
              </div>
            </label>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Max members
              <div className="mt-2 rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm">
                6
              </div>
            </label>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Difficulty level
              <div className="mt-2 flex flex-wrap gap-2">
                {"Beginner Advanced Pro".split(" ").map((level, index) => (
                  <span
                    key={level}
                    className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${
                      index === 0
                        ? "bg-(--admin-accent) text-black"
                        : "bg-[#1a1a1a] text-white/50"
                    }`}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </label>
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Assign members
              <div className="mt-2 rounded-xl border border-white/10 bg-[#111111] px-3 py-2 text-sm text-white/40">
                Search by name, ID, or rank...
              </div>
            </label>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Link className="text-xs uppercase tracking-[0.3em] text-white/40" href="/admin">
              Cancel
            </Link>
            <button className="rounded-full bg-(--admin-accent) px-4 py-2 text-xs font-semibold text-black">
              Save group
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
