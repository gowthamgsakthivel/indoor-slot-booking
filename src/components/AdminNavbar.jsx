"use client";

export default function AdminNavbar() {
  return (
    <header className="fixed right-0 top-0 z-40 h-16 w-[calc(100%-16rem)] border-b border-white/5 bg-stone-950/80 backdrop-blur-md">
      <div className="flex h-full w-full items-center justify-between px-8">
        <div className="flex w-full max-w-md flex-1 items-center">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">
              search
            </span>
            <input
              className="w-full rounded-lg border-none bg-surface-container-low py-2 pl-10 pr-4 text-sm placeholder:text-stone-600 focus:ring-1 focus:ring-secondary/50"
              placeholder="Search members, groups, or courts..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-stone-400 transition-colors hover:text-orange-400">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
