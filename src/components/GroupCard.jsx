import Image from "next/image";

const defaultMembers = [];

export default function GroupCard({
  badge,
  time,
  title,
  capacity,
  capacityTotal,
  members = defaultMembers,
  accent,
  isFull,
  showAddSlot,
}) {
  return (
    <div
      className={`rounded-lg bg-surface-container-low p-1 transition-all duration-300 ${
        accent ? `hover:ring-1 ${accent}` : ""
      }`}
    >
      <div className="relative flex h-full flex-col rounded-md bg-surface-container-high p-8">
        {isFull && (
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rotate-45 bg-secondary/5" />
        )}

        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                  isFull
                    ? "bg-secondary/10 text-secondary"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {badge}
              </span>
              <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {time}
              </span>
            </div>
            <h4 className="font-headline text-3xl font-black tracking-tighter">
              {title}
            </h4>
          </div>
          <div className="text-right">
            {isFull ? (
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-black uppercase tracking-widest text-on-secondary-fixed shadow-[0_4px_12px_rgba(0,227,253,0.3)]">
                FULL
              </span>
            ) : (
              <>
                <span className="mb-1 block text-[10px] font-bold uppercase text-on-surface-variant">
                  Capacity
                </span>
                <span className="font-headline text-2xl font-black text-primary">
                  {capacity}
                  <span className="text-stone-600">/{capacityTotal}</span>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Active Members
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            {members.map((member, index) => (
              <div
                key={`${member.alt}-${index}`}
                className={member.active ? "relative group/avatar" : ""}
              >
                <Image
                  alt={member.alt}
                  className={`h-12 w-12 rounded-lg border border-white/10 transition-all ${
                    member.dim ? "grayscale hover:grayscale-0" : ""
                  }`}
                  src={member.src}
                  width={48}
                  height={48}
                  sizes="48px"
                />
                {member.active && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-surface-container-high bg-primary" />
                )}
              </div>
            ))}

            {showAddSlot && (
              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary">
                <span className="material-symbols-outlined">add</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex gap-2">
            <button className="rounded-md bg-surface-container-highest p-3 text-white transition-colors hover:bg-surface-bright">
              <span className="material-symbols-outlined">edit</span>
            </button>
            <button className="rounded-md bg-surface-container-highest p-3 text-error transition-colors hover:bg-error-container hover:text-white">
              <span className="material-symbols-outlined">person_remove</span>
            </button>
          </div>
          {isFull ? (
            <div className="text-right">
              <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Max Occupancy
              </span>
              <span className="font-headline text-lg font-black text-secondary">
                {capacityTotal}/{capacityTotal} MEMBERS
              </span>
            </div>
          ) : (
            <button className="rounded-md bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-on-primary">
              Add Member
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
