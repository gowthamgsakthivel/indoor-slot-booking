import Link from "next/link";

const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
const courts = [
  "Court 1 - Indoor",
  "Court 2 - Indoor",
  "Court 3 - Indoor",
  "Court 4 - Indoor",
];
const slots = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
];

export default function BookPage() {
  return (
    <div className="bg-playful grid-dots min-h-screen">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-20 pt-8 sm:px-10">
        <header className="glass-strong flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-6">
          <div>
            <p className="text-display text-2xl font-semibold">Book a slot</p>
            <p className="text-sm text-black/60">
              Pick a day, choose a court, reserve your hour.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <span className="rounded-full border border-black/10 px-4 py-2">
              Rs 50 per player
            </span>
            <span className="rounded-full border border-black/10 px-4 py-2">
              Rs 200 per court
            </span>
            <Link className="rounded-full bg-(--ink) px-4 py-2 text-white" href="/">
              Back home
            </Link>
          </div>
        </header>

        <section className="glass rounded-[28px] px-6 py-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/50">
            Select a day
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {days.map((day, index) => (
              <button
                key={day}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  index === 0
                    ? "bg-(--lavender) text-black"
                    : "border border-black/10 bg-white/70"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-[28px] px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-display text-lg font-semibold">Court schedule</p>
              <span className="rounded-full bg-(--mint) px-3 py-1 text-xs font-semibold">
                24/7 open
              </span>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              {courts.map((court) => (
                <div
                  key={court}
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{court}</p>
                    <span className="text-xs text-black/50">Synthetic surface</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.slice(0, 10).map((slot, index) => (
                      <button
                        key={slot}
                        className={`rounded-full px-3 py-1 text-xs ${
                          index % 3 === 0
                            ? "bg-(--sky)/70"
                            : "border border-black/10"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong flex flex-col gap-6 rounded-[28px] px-6 py-6">
            <div>
              <p className="text-display text-lg font-semibold">Your booking</p>
              <p className="text-sm text-black/60">
                Log in to confirm, pay later at the venue.
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-4">
              <p className="text-sm font-semibold">Selected slot</p>
              <p className="mt-1 text-sm text-black/60">
                Court 2, Today, 06:00 PM
              </p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-4">
              <p className="text-sm font-semibold">Players</p>
              <p className="mt-1 text-sm text-black/60">4 players, split Rs 200</p>
            </div>
            <button className="rounded-2xl bg-(--ink) px-4 py-3 text-sm font-semibold text-white">
              Sign in to confirm
            </button>
            <p className="text-xs text-black/50">
              NextAuth + MongoDB wiring will connect this flow.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
