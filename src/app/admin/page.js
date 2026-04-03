import Link from "next/link";
import { Bell, ChevronRight, Search, Shield } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

const statCards = [];
const recentActivity = [];
const operations = [];
const groupCards = [];

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="admin-bg admin-grid min-h-screen">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <AdminNavbar />
        <main className="ml-64 flex-1 px-6 pb-24 pt-24 lg:px-10">
          <div className="admin-slide-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-[#141414] px-4 py-2 text-sm text-white/60">
                  <Search size={16} />
                  <input
                    className="w-52 bg-transparent text-sm outline-none placeholder:text-white/30"
                    placeholder="Quick search..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50">
                  <span className="h-2 w-2 rounded-full bg-(--admin-accent)" />
                  System online
                </span>
                <button className="rounded-full border border-white/5 bg-[#161616] p-2 text-white/70">
                  <Bell size={16} />
                </button>
                <button className="rounded-full border border-white/5 bg-[#161616] px-3 py-2 text-xs font-semibold text-white/80">
                  + Member
                </button>
                <button className="rounded-full bg-(--admin-accent-2) px-3 py-2 text-xs font-semibold text-black">
                  New booking
                </button>
                <Link
                  className="rounded-full border border-white/5 bg-[#161616] px-3 py-2 text-xs font-semibold text-white/70"
                  href="/"
                >
                  Back home
                </Link>
              </div>
            </div>

            <section className="mt-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight">Performance Overview</h1>
                  <p className="admin-muted text-sm">
                    Real-time telemetry for Kinetic Onyx.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                {statCards.length === 0 ? (
                  <div className="admin-panel rounded-2xl p-4 text-sm text-white/60">
                    No stats available yet.
                  </div>
                ) : (
                  statCards.map((card) => (
                    <div
                      key={card.label}
                      className="admin-panel rounded-2xl p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                        {card.label}
                      </p>
                      <p className={`mt-3 text-3xl font-black ${card.accent.split(" ")[1]}`}>
                        {card.value}
                      </p>
                      <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[10px] ${card.accent}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {card.delta}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="admin-panel rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent activity</h2>
                  <button className="text-xs font-semibold uppercase tracking-[0.3em] text-(--admin-accent-2)">
                    View all activity
                  </button>
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">
                  <div className="grid grid-cols-[1.4fr_1.2fr_1fr_0.6fr] gap-4 bg-[#121212] px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-white/40">
                    <span>Member</span>
                    <span>Service</span>
                    <span>Status</span>
                    <span>Time</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {recentActivity.length === 0 ? (
                      <div className="px-4 py-6 text-sm text-white/60">
                        No recent activity yet.
                      </div>
                    ) : (
                      recentActivity.map((row) => (
                        <div
                          key={`${row.member}-${row.time}`}
                          className="grid grid-cols-[1.4fr_1.2fr_1fr_0.6fr] gap-4 px-4 py-4 text-sm"
                        >
                          <div>
                            <p className="font-semibold">{row.member}</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                              {row.tier}
                            </p>
                          </div>
                          <div>
                            <p className="font-semibold">{row.service}</p>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                              {row.tier}
                            </p>
                          </div>
                          <span
                            className={`inline-flex h-7 items-center justify-center rounded-full px-3 text-[10px] font-semibold uppercase tracking-[0.3em] ${row.badge}`}
                          >
                            {row.status}
                          </span>
                          <span className="text-sm text-white/70">{row.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="admin-panel rounded-2xl p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                    Operations
                  </h3>
                  <div className="mt-4 flex flex-col gap-3">
                    {operations.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-[#141414] px-4 py-3 text-xs text-white/60">
                        No operations configured.
                      </div>
                    ) : (
                      operations.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.title}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-[#141414] px-4 py-3 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`rounded-lg p-2 ${item.tone}`}>
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{item.title}</p>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-white/30" />
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="admin-panel rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/40">Live peak load</p>
                    <Shield size={16} className="text-(--admin-accent)" />
                  </div>
                  <div className="mt-6 flex items-baseline gap-2">
                    <p className="text-4xl font-black">84%</p>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                      System capacity reached
                    </span>
                  </div>
                  <div className="mt-6 rounded-2xl bg-[#111111] p-4">
                    <svg viewBox="0 0 240 80" className="h-16 w-full">
                      <path
                        d="M0 60 C20 20, 40 20, 60 52 C80 84, 100 30, 120 38 C140 46, 160 70, 180 40 C200 10, 220 20, 240 20"
                        fill="none"
                        stroke="#7cff4f"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/30">
                      <span>00:00</span>
                      <span>12:00</span>
                      <span>20:00</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Group Management</h2>
                  <p className="admin-muted text-sm">
                    Orchestrate athlete collective for peak court efficiency.
                  </p>
                </div>
                <Link
                  className="rounded-full bg-(--admin-accent) px-4 py-2 text-xs font-semibold text-black"
                  href="/admin/groups/new"
                >
                  + Create group
                </Link>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                <div className="admin-panel rounded-2xl p-4 text-sm text-white/60">
                  Group metrics will appear once data is available.
                </div>
              </div>

              <div className="mt-6 grid gap-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {groupCards.length === 0 ? (
                    <div className="admin-panel rounded-2xl p-5 text-sm text-white/60">
                      No groups to display.
                    </div>
                  ) : (
                    groupCards.map((group) => (
                      <div key={group.name} className="admin-panel rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-[#1c1c1c] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/50">
                            {group.court}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${
                              group.status === "Full"
                                ? "bg-[#1f2a1f] text-(--admin-accent)"
                                : "bg-[#151c22] text-(--admin-accent-2)"
                            }`}
                          >
                            {group.status}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-black">{group.name}</h3>
                        <p className="text-sm text-white/60">{group.time}</p>
                        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/40">
                          <span>Capacity</span>
                          <span className="text-white">{group.capacity}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <button className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white/70">
                            Add member
                          </button>
                          <button className="rounded-full bg-[#1a1a1a] px-3 py-2 text-xs font-semibold text-white/70">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

    </div>
  );
}
