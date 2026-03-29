import Link from "next/link";

const courtStatus = [
  { name: "Court 1", status: "Open", nextSlot: "06:00 PM" },
  { name: "Court 2", status: "Reserved", nextSlot: "07:00 PM" },
  { name: "Court 3", status: "Open", nextSlot: "06:00 PM" },
  { name: "Court 4", status: "Cleaning", nextSlot: "08:00 PM" },
];

const queue = [
  { name: "Aarav", time: "06:00 PM", court: "Court 2" },
  { name: "Meera", time: "07:00 PM", court: "Court 1" },
  { name: "Dev", time: "08:00 PM", court: "Court 4" },
];

export default function AdminPage() {
  return (
    <div className="bg-playful grid-dots min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-8 sm:px-10">
        <header className="glass-strong flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-6">
          <div>
            <p className="text-display text-2xl font-semibold">Admin control</p>
            <p className="text-sm text-black/60">
              Manage courts, slots, and pricing for NKL.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <span className="rounded-full border border-black/10 px-4 py-2">
              4 courts
            </span>
            <span className="rounded-full border border-black/10 px-4 py-2">
              24/7 slots
            </span>
            <Link className="rounded-full bg-(--ink) px-4 py-2 text-white" href="/">
              Back home
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          {[
            { label: "Total bookings", value: "128" },
            { label: "Active players", value: "76" },
            { label: "Revenue (today)", value: "Rs 4,800" },
          ].map((card) => (
            <div key={card.label} className="glass rounded-[26px] px-6 py-6">
              <p className="text-sm text-black/60">{card.label}</p>
              <p className="text-display mt-2 text-3xl font-semibold">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-[28px] px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-display text-lg font-semibold">Court status</p>
              <button className="rounded-full border border-black/10 px-3 py-1 text-xs">
                Edit slots
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {courtStatus.map((court) => (
                <div
                  key={court.name}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{court.name}</p>
                    <p className="text-xs text-black/60">Next: {court.nextSlot}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      court.status === "Open"
                        ? "bg-(--mint)"
                        : court.status === "Reserved"
                        ? "bg-(--lavender)"
                        : "bg-(--sunset)"
                    }`}
                  >
                    {court.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong flex flex-col gap-6 rounded-[28px] px-6 py-6">
            <div>
              <p className="text-display text-lg font-semibold">Upcoming check-ins</p>
              <p className="text-sm text-black/60">
                Keep the flow smooth with quick approvals.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {queue.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/80 px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-black/60">
                      {item.court} · {item.time}
                    </p>
                  </div>
                  <button className="rounded-full bg-(--ink) px-3 py-1 text-xs font-semibold text-white">
                    Approve
                  </button>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-4">
              <p className="text-sm font-semibold">Pricing quick edit</p>
              <div className="mt-3 flex flex-col gap-2 text-xs text-black/60">
                <span>Rs 50 per player</span>
                <span>Rs 200 per court/hr</span>
              </div>
              <button className="mt-4 rounded-full border border-black/10 px-3 py-1 text-xs">
                Update pricing
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
