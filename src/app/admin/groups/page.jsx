"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import CreateGroupModal from "@/components/CreateGroupModal";
import GroupCard from "@/components/GroupCard";

const stats = [];

const mapGroupToCard = (group, index) => {
  const capacityTotal = group.maxMembers ?? group.capacity ?? 6;
  const capacity = Array.isArray(group.members) ? group.members.length : 0;
  const isFull = capacityTotal > 0 && capacity >= capacityTotal;
  const courtLabel = group.court || (group.courtId ? `Court ${group.courtId}` : "Court");
  const timeLabel = group.time || group.slot || "06:00 AM - 07:00 AM";
  return {
    id: group._id || group.id || `group-${index}`,
    badge: courtLabel,
    time: timeLabel,
    title: group.name || `Group ${index + 1}`,
    capacity,
    capacityTotal,
    members: [],
    accent: isFull ? "hover:ring-secondary/20" : "hover:ring-primary/20",
    isFull,
    showAddSlot: !isFull,
  };
};

export default function AdminGroupsPage() {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/groups", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load groups");
        }
        const data = await response.json();
        setGroups(Array.isArray(data?.groups) ? data.groups : []);
      } catch (err) {
        setError("Unable to load groups right now.");
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  const handleCreateGroup = async (payload) => {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create group");
    }

    const data = await response.json();
    if (data?.group) {
      setGroups((prev) => [data.group, ...prev]);
    }
    console.info("Group created successfully");
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <AdminSidebar />
      <AdminNavbar />

      <main className="ml-64 min-h-screen px-8 pb-12 pt-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-headline text-4xl font-black uppercase tracking-tight">
              Group Management
            </h2>
            <p className="font-label text-sm tracking-wide text-on-surface-variant">
              Orchestrate and optimize athlete collectives for peak court efficiency.
            </p>
          </div>
          <button
            className="kinetic-gradient flex items-center gap-2 rounded-md px-6 py-3 font-headline text-sm font-bold text-on-primary-fixed shadow-[0_10px_20px_rgba(142,255,113,0.2)] transition-all active:scale-95"
            onClick={() => setOpen(true)}
            type="button"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              add
            </span>
            CREATE GROUP
          </button>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-4">
          {stats.length === 0 ? (
            <div className="glass-card rounded-lg p-6 text-sm text-on-surface-variant">
              Group stats will appear once data is available.
            </div>
          ) : (
            stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-lg p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </p>
                <h3 className={`font-headline text-4xl font-black ${stat.tone}`}>
                  {stat.value}
                </h3>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div className={`h-full ${stat.bar} ${stat.progress}`} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {groups.map((group, index) => (
            <GroupCard key={group._id || group.id || index} {...mapGroupToCard(group, index)} />
          ))}

          {!loading && groups.length === 0 && (
            <div className="glass-card flex h-full flex-col items-center justify-center gap-3 rounded-lg p-8 text-center">
              <p className="text-sm font-semibold text-on-surface-variant">No groups yet</p>
              <p className="text-xs text-stone-500">Create your first squad to get started.</p>
            </div>
          )}

          {error && (
            <div className="glass-card flex h-full flex-col items-center justify-center gap-2 rounded-lg p-8 text-center">
              <p className="text-sm font-semibold text-error">{error}</p>
            </div>
          )}

          <div className="glass-card flex flex-col items-center justify-between gap-8 rounded-lg border-2 border-dashed border-outline-variant/30 p-8 md:flex-row lg:col-span-2">
            <div className="flex items-center gap-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface-container-low bg-surface-container-highest outline outline-2 outline-white/5">
                <span className="material-symbols-outlined text-4xl text-stone-700">
                  stadium
                </span>
              </div>
              <div>
                <h5 className="font-headline text-xl font-black tracking-tighter text-stone-400">
                  No open slot data
                </h5>
                <p className="font-label text-sm text-stone-600">
                  Add groups to start tracking empty courts.
                </p>
              </div>
            </div>
            <button className="rounded-md border-2 border-primary/20 px-8 py-4 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary/5">
              Quick Schedule
            </button>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-16">
          <h4 className="mb-8 font-headline text-sm font-black uppercase tracking-[0.3em] text-on-surface-variant">
            Performance Scorecards
          </h4>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative rounded-lg bg-surface-container-highest p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Group Retention
              </p>
              <div className="flex items-end gap-2">
                <span className="font-headline text-4xl font-black text-primary">
                  88%
                </span>
                <span className="mb-1 text-xs font-bold text-primary">▲ 4%</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg">
                <div className="kinetic-gradient h-full w-[88%] shadow-[0_0_10px_#8eff71]" />
              </div>
            </div>

            <div className="group relative rounded-lg bg-surface-container-highest p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Waitlist Average
              </p>
              <div className="flex items-end gap-2">
                <span className="font-headline text-4xl font-black text-secondary">
                  4.2
                </span>
                <span className="mb-1 text-xs font-bold text-secondary">athletes</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg">
                <div className="h-full w-[42%] bg-secondary shadow-[0_0_10px_#00e3fd]" />
              </div>
            </div>

            <div className="group relative rounded-lg bg-surface-container-highest p-6">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Peak Hours
              </p>
              <div className="flex items-end gap-2">
                <span className="font-headline text-4xl font-black text-white">
                  06:00
                </span>
                <span className="mb-1 text-xs font-bold text-stone-500">Standard</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-lg">
                <div className="h-full w-full bg-white opacity-10" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <button className="kinetic-gradient fixed bottom-10 right-10 z-50 flex h-16 w-16 items-center justify-center rounded-full text-on-primary-fixed shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all hover:scale-110 active:scale-90">
        <span
          className="material-symbols-outlined text-3xl"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          bolt
        </span>
      </button>

      {open && (
        <CreateGroupModal
          onClose={() => setOpen(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}
