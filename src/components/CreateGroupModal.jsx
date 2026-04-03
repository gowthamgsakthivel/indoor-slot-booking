import { useState } from "react";

const difficultyOptions = ["Beginner", "Advanced", "Pro"];

export default function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [court, setCourt] = useState("Court 1");
  const [timeSlot, setTimeSlot] = useState("06:00 AM - 07:00 AM");
  const [maxMembers, setMaxMembers] = useState(6);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }
    if (!onCreate) {
      onClose();
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        court,
        time: timeSlot,
        maxMembers: Number(maxMembers) || 1,
        level: difficulty,
      });
      onClose();
    } catch (err) {
      setError("Unable to create group. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-2xl overflow-hidden rounded-lg shadow-[0px_20px_40px_rgba(0,0,0,0.6)]">
        <div className="border-b border-outline-variant/10 p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  NextGen System
                </span>
              </div>
              <h3 className="font-headline text-3xl font-black uppercase tracking-tighter text-white">
                Create New Squad
              </h3>
            </div>
            <button
              className="text-stone-500 transition-colors hover:text-white"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div className="no-scrollbar max-h-[716px] space-y-8 overflow-y-auto p-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Group Name
              </label>
              <input
                className="w-full rounded-t bg-surface-container-highest px-4 py-3 font-body text-on-surface outline-none transition-all focus:border-secondary border-b-2 border-transparent"
                placeholder="Enter squad name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Select Court
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-t bg-surface-container-highest px-4 py-3 font-body text-on-surface outline-none transition-all focus:border-secondary border-b-2 border-transparent"
                  onChange={(event) => setCourt(event.target.value)}
                  value={court}
                >
                  <option value="Court 1">Court 1 - Professional Hardwood</option>
                  <option value="Court 2">Court 2 - Professional Hardwood</option>
                  <option value="Court 3">Court 3 - Performance Clay</option>
                  <option value="Court 4">Court 4 - Grass Lite</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                  expand_more
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Time Slot
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-t bg-surface-container-highest px-4 py-3 font-body text-on-surface outline-none transition-all focus:border-secondary border-b-2 border-transparent"
                  onChange={(event) => setTimeSlot(event.target.value)}
                  value={timeSlot}
                >
                  <option>06:00 AM - 07:00 AM</option>
                  <option>07:00 AM - 08:00 AM</option>
                  <option>08:00 AM - 09:00 AM</option>
                  <option>05:00 PM - 06:00 PM</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                  schedule
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Max Members
              </label>
              <div className="relative">
                <input
                  className="w-full rounded-t bg-surface-container-highest px-4 py-3 font-body text-on-surface outline-none transition-all focus:border-secondary border-b-2 border-transparent"
                  max="20"
                  min="1"
                  type="number"
                  value={maxMembers}
                  onChange={(event) => setMaxMembers(event.target.value)}
                />
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">
                  group_add
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option}
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors ${
                      option === difficulty
                        ? "bg-primary-container text-on-primary-fixed"
                        : "bg-surface-container-highest text-stone-400 hover:bg-outline-variant/20"
                    }`}
                    onClick={() => setDifficulty(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Assign Members
            </label>
            <div className="relative flex items-center border-b-2 border-outline-variant/30 bg-surface-container-low p-1 transition-all focus-within:border-secondary">
              <span className="material-symbols-outlined px-3 text-stone-500">
                person_search
              </span>
              <input
                className="w-full bg-transparent py-3 text-sm font-body outline-none"
                placeholder="Search by name, ID or rank..."
                type="text"
              />
              <button className="bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-secondary/20">
                Add
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="group relative flex items-center gap-3 rounded bg-surface-container-highest/40 p-3">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-stone-800">
                  <img
                    className="h-full w-full object-cover"
                    alt="Marcus Thorne"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXptVfdbPT2h7eusCxu2JJiu3kLqCrioZyIoKgzwkLWacy_LuH5MwjVzRSGYVfouXE7a33WFgqtz-oK0HCFrqx42FfRAJ7h25BlADfwLiaibO3xsIY0ZkDqa_a6nFA90Fj9hOM96xk5rkN2LJVPgai-qlmd-Rs9oe1xey2q2oETyArsInSxuWl2XL63ytbrdXJMCIRlZDykRWSMzfpIQRHlTXWr24AJ-ytCxSUj6354JxqERbgh49UH27LJS81sFMrT44XbOiSk8e0"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Marcus Thorne</p>
                  <p className="text-[10px] uppercase tracking-tighter text-stone-500">
                    Rank #12 • Platinum
                  </p>
                </div>
                <button
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white opacity-0 transition-opacity group-hover:opacity-100"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>

              <div className="group relative flex items-center gap-3 rounded bg-surface-container-highest/40 p-3">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-stone-800">
                  <img
                    className="h-full w-full object-cover"
                    alt="Sarah Jenkins"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLoG9I33kS_PnVNlgDS-geRfWYfM8GftC4kEU0Cs-9UKfEtbDzVhtiffl-kXL2-Qp52pmCjc5tV5FyZ7Jhk2OZAT0j32VxgO-1_1Zz8s11baiNL4oFJEj6Yq1RambW4sBPckQz8Owtu1-u9YbwTfe1I0JJEO5TrqOBsMPBLG4wT0liUeMEqulCCgI5PMLTdZcAfwJ2sCskFxE17bjOv3oHNv1WHVTnb363oQ0fdVsmwwGfgR5DKu1EnZyaY4tq7MJ5IXEkWXULZizD"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none">Sarah Jenkins</p>
                  <p className="text-[10px] uppercase tracking-tighter text-stone-500">
                    Rank #45 • Gold
                  </p>
                </div>
                <button
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-white opacity-0 transition-opacity group-hover:opacity-100"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>

              <div className="flex items-center justify-center rounded border border-dashed border-outline-variant/30 p-3 text-stone-600">
                <span className="text-[10px] font-bold uppercase tracking-widest italic">
                  Slot Available
                </span>
              </div>
              <div className="flex items-center justify-center rounded border border-dashed border-outline-variant/30 p-3 text-stone-600">
                <span className="text-[10px] font-bold uppercase tracking-widest italic">
                  Slot Available
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-container-low p-8">
          <button
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-stone-400 transition-colors hover:text-white"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined">undo</span>
            Cancel
          </button>
          <div className="flex gap-4">
            <button
              className="rounded-md bg-primary px-8 py-4 text-sm font-black uppercase tracking-widest text-on-primary-fixed shadow-[0_10px_20px_rgba(142,255,113,0.2)] transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSave}
              type="button"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Group"}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-8 pb-6 text-xs font-semibold text-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
