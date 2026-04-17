"use client";

/** Converts a full name string to up to 2 uppercase initials */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "MB";
}

/**
 * Generates a deterministic hue from a string so each member gets a
 * consistent colour without needing an avatar image.
 */
function hueFromName(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export default function GroupCard({
  badge,
  time,
  title,
  capacity,
  capacityTotal,
  members = [],
  isFull,
  onEdit,
  onAddMember,
  onRemoveMember,
  onDelete,
}) {
  const filled = Number(capacity) || members.length;
  const total = Number(capacityTotal) || 6;

  return (
    <div
      className={`group/card relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isFull
          ? "border-[#00e3fd]/20 bg-[#0f1a1d]"
          : "border-white/6 bg-[#141414] hover:border-white/10"
      }`}
    >
      {/* Subtle top-edge glow line */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${
          isFull
            ? "bg-gradient-to-r from-transparent via-[#00e3fd]/50 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#7cff4f]/20 to-transparent"
        }`}
      />

      <div className="p-6">
        {/* ── Header row ───────────────────────── */}
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Court badge */}
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                isFull
                  ? "bg-[#00e3fd]/15 text-[#00e3fd]"
                  : "bg-[#7cff4f]/10 text-[#7cff4f]"
              }`}
            >
              {badge}
            </span>

            {/* Time */}
            <span className="flex items-center gap-1.5 text-xs text-white/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {time}
            </span>
          </div>

          {/* Capacity / Full badge */}
          {isFull ? (
            <span className="rounded-full bg-[#00e3fd] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-[0_0_16px_rgba(0,227,253,0.35)]">
              FULL
            </span>
          ) : (
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
                Capacity
              </p>
              <p className="mt-0.5 font-black leading-none text-[#7cff4f]">
                <span className="text-2xl">{filled}</span>
                <span className="text-lg text-white/30">/{total}</span>
              </p>
            </div>
          )}
        </div>

        {/* ── Group title ──────────────────────── */}
        <h3 className="mt-4 text-3xl font-black tracking-tight text-white">
          {title}
        </h3>

        {/* ── Members section ──────────────────── */}
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
            Active Members
          </p>

          <div className="flex flex-wrap gap-2">
            {members.map((member, idx) => {
              const hue = hueFromName(member.name);
              return (
                <div key={member.id || idx} className="group/avatar relative">
                  {/* Avatar tile */}
                  <div
                    className="flex h-13 w-13 flex-col items-center justify-center rounded-xl border border-white/8 text-[11px] font-black uppercase tracking-wider text-white shadow-md transition-transform duration-200 hover:scale-105"
                    style={{
                      background: `hsl(${hue} 40% 16%)`,
                      borderColor: `hsl(${hue} 40% 28%)`,
                    }}
                    title={member.name}
                  >
                    <span style={{ color: `hsl(${hue} 80% 70%)` }}>
                      {getInitials(member.name)}
                    </span>
                  </div>

                  {/* Remove button – appears on hover */}
                  {onRemoveMember && (
                    <button
                      type="button"
                      onClick={() => onRemoveMember(member.id)}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff5f56] text-[8px] font-black text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/avatar:opacity-100"
                      title={`Remove ${member.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}

            {/* Add-member slot tile (only when not full) */}
            {!isFull && onAddMember && (
              <button
                type="button"
                onClick={onAddMember}
                className="flex h-13 w-13 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/15 text-white/30 transition-all duration-200 hover:border-[#7cff4f]/60 hover:text-[#7cff4f]"
                title="Add member"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer action bar ─────────────────── */}
      <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
        <div className="flex gap-2">
          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/60 transition-colors hover:border-white/15 hover:bg-white/10 hover:text-white"
            title="Edit group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete / remove member */}
          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ff5f56]/20 bg-[#ff5f56]/10 text-[#ff5f56] transition-colors hover:bg-[#ff5f56]/20"
            title="Delete group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="17" y1="8" x2="23" y2="14" />
              <line x1="23" y1="8" x2="17" y2="14" />
            </svg>
          </button>
        </div>

        {isFull ? (
          <div className="text-right">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">
              Max Occupancy
            </p>
            <p className="mt-0.5 font-black text-[#00e3fd]">
              {total}/{total} MEMBERS
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAddMember}
            className="rounded-xl border border-[#7cff4f]/20 bg-[#7cff4f]/8 px-5 py-2 text-xs font-black uppercase tracking-widest text-[#7cff4f] transition-all hover:bg-[#7cff4f]/15 hover:shadow-[0_0_16px_rgba(124,255,79,0.2)]"
          >
            Add Member
          </button>
        )}
      </div>
    </div>
  );
}
