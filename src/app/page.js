"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const courts = [
    "Court 1 - Indoor",
    "Court 2 - Indoor",
    "Court 3 - Indoor",
    "Court 4 - Indoor",
  ];
  const slots = [
    "06:00 AM",
    "08:00 AM",
    "10:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
    "08:00 PM",
  ];
  const highlights = [
    {
      title: "24/7 open",
      description: "Book any time, last minute or a week ahead.",
    },
    {
      title: "1-hour slots",
      description: "Fast rotations keep the energy high.",
    },
    {
      title: "Pricing",
      description: "Rs 50 per person or Rs 200 per court/hr.",
    },
    {
      title: "Indoor comfort",
      description: "4 synthetic courts, weather-proof play.",
    },
  ];

  const handleSliderChange = (event) => {
    const nextValue = Number(event.target.value);
    setSliderValue(nextValue);
    if (nextValue >= 95) {
      setIntroComplete(true);
    }
  };

  if (!introComplete) {
    return (
      <div className="bg-playful grid-dots min-h-screen">
        <div className="relative overflow-hidden">
          <div className="absolute -top-24 left-10 h-40 w-40 rounded-full bg-(--mint) blur-3xl opacity-70 float-slow" />
          <div className="absolute top-24 right-12 h-52 w-52 rounded-full bg-(--lavender) blur-3xl opacity-70 float-fast" />
          <div className="absolute bottom-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-(--sunset) blur-3xl opacity-70 float-slow" />
        </div>

        <main className="intro-stage relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:px-10">
          <div className="glass-strong relative w-full overflow-hidden rounded-3xl px-6 py-10">
            <div className="orbit-ring absolute inset-6 rounded-full border border-black/10" />
            <div className="scanline absolute left-1/2 top-0 h-full w-1/3 -translate-x-1/2 bg-[linear-gradient(120deg,transparent,rgba(255,179,107,0.35),transparent)]" />
            <p className="intro-badge relative z-10 text-sm font-semibold uppercase tracking-[0.35em] text-black/60">
              Smash arena
            </p>
            <h1 className="intro-title text-display relative z-10 mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Love All
            </h1>
            <p className="intro-subtitle relative z-10 mt-4 text-base uppercase tracking-[0.3em] text-black/50">
              Indoor court booking platform
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-black/60">
                System ready
              </div>
              <div className="text-xs font-semibold text-black/50">
                {Math.min(100, Math.round(sliderValue))}%
              </div>
            </div>
          </div>

          <div className="glass intro-slider w-full max-w-md rounded-3xl px-6 py-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-black/50">
              <span>Swipe to play</span>
              <span>Go</span>
            </div>
            <div className="relative mt-5">
              <div className="pointer-events-none absolute inset-0 rounded-full bg-black/10" />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,rgba(18,11,24,0.08),rgba(255,179,107,0.45))]"
                style={{ width: `${Math.min(100, sliderValue)}%` }}
              />
              <div
                className="pointer-events-none absolute -top-5"
                style={{ left: `calc(${Math.min(100, sliderValue)}% - 18px)` }}
              >
                <div className="swipe-shuttle" />
              </div>
              <input
                aria-label="Slide to enter"
                className="range-glow relative z-10 h-3 w-full cursor-pointer appearance-none rounded-full"
                max="100"
                min="0"
                onChange={handleSliderChange}
                type="range"
                value={sliderValue}
              />
            </div>
            <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.3em] text-black/40">
              <span>Agree to arena rules</span>
              <button
                className="rounded-full border border-black/10 px-3 py-1 text-[10px] font-semibold"
                onClick={() => setIntroComplete(true)}
                type="button"
              >
                Skip
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-playful grid-dots min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 left-10 h-40 w-40 rounded-full bg-(--mint) blur-3xl opacity-70 float-slow" />
        <div className="absolute top-24 right-12 h-52 w-52 rounded-full bg-(--lavender) blur-3xl opacity-70 float-fast" />
        <div className="absolute bottom-10 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-(--sunset) blur-3xl opacity-70 float-slow" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-8 sm:px-10">
        <header className="glass-strong flex flex-col gap-6 rounded-3xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-(--ink) text-lg font-bold text-white">
              NKL
            </span>
            <div>
              <p className="text-display text-lg font-semibold">NKL Sports Club</p>
              <p className="text-sm text-black/60">Badminton booking, reimagined.</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-medium">
            <Link className="rounded-full border border-black/10 px-4 py-2" href="/book">
              Book a slot
            </Link>
            <Link className="rounded-full border border-black/10 px-4 py-2" href="/admin">
              Admin
            </Link>
            <span className="rounded-full border border-black/10 px-4 py-2">
              24/7 open
            </span>
          </nav>
        </header>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-8">
            <div className="glass rounded-4xl px-8 py-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black/60">
                Indoor courts, instant energy
              </p>
              <h1 className="text-display mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                Book your badminton slot in seconds, play all day.
              </h1>
              <p className="mt-4 text-lg text-black/70">
                Four synthetic courts. Always open. Pick a time, split the price, and
                step in with your crew.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  className="shimmer rounded-full bg-[linear-gradient(120deg,var(--ink),#3a195a,var(--berry))] px-6 py-3 text-sm font-semibold text-white"
                  href="/book"
                >
                  Start booking
                </Link>
                <button className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold">
                  See prices
                </button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-sm text-black/60">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass flex flex-col gap-6 rounded-[28px] px-8 py-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-display text-xl font-semibold">Today at NKL</p>
                  <p className="text-sm text-black/60">Quick look at active court vibes.</p>
                </div>
                <span className="rounded-full bg-(--mint) px-4 py-2 text-xs font-semibold text-black">
                  4 courts live
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {["Doubles drills", "Casual rally", "Tournament practice"].map(
                  (label) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-black/10 bg-white/80 px-4 py-5"
                    >
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-xs text-black/60">
                        Queue open, join anytime.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="glass-strong flex flex-col gap-6 rounded-4xl px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-display text-xl font-semibold">Book a slot</p>
                <p className="text-sm text-black/60">Select a court and time.</p>
              </div>
              <span className="rounded-full border border-black/10 px-3 py-1 text-xs">
                Rs 200/hr
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {courts.map((court) => (
                <div
                  key={court}
                  className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{court}</p>
                    <span className="rounded-full bg-(--sky) px-3 py-1 text-xs font-semibold">
                      24/7
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.slice(0, 4).map((slot) => (
                      <button
                        key={slot}
                        className="rounded-full border border-black/10 px-3 py-1 text-xs"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Link
              className="rounded-2xl bg-(--ink) px-4 py-3 text-center text-sm font-semibold text-white"
              href="/book"
            >
              Open full schedule
            </Link>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-[26px] px-6 py-6">
            <p className="text-display text-lg font-semibold">How it works</p>
            <ol className="mt-4 flex flex-col gap-3 text-sm text-black/70">
              <li>Pick a court and time.</li>
              <li>Split the price or book full court.</li>
              <li>Check in, play, repeat.</li>
            </ol>
          </div>
          <div className="glass rounded-[26px] px-6 py-6">
            <p className="text-display text-lg font-semibold">Pricing picks</p>
            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold">Per player</p>
                <p className="text-xs text-black/60">Rs 50 / person</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold">Full court</p>
                <p className="text-xs text-black/60">Rs 200 / hour</p>
              </div>
            </div>
          </div>
          <div className="glass rounded-[26px] px-6 py-6">
            <p className="text-display text-lg font-semibold">Community vibe</p>
            <p className="mt-3 text-sm text-black/70">
              Built for Gen Z energy: fast matches, fast bookings, and a space
              that feels alive 24/7.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Glow courts", "Night slots", "Student crews"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-(--lavender) px-3 py-1 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <footer className="glass-strong flex flex-col items-center gap-3 rounded-3xl px-6 py-6 text-center">
          <p className="text-display text-lg font-semibold">
            Ready to lock your next rally?
          </p>
          <p className="text-sm text-black/60">
            Book instantly or hop into admin to manage court slots.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-(--ink) px-5 py-2 text-sm font-semibold text-white"
              href="/book"
            >
              Book now
            </Link>
            <Link
              className="rounded-full border border-black/10 px-5 py-2 text-sm font-semibold"
              href="/admin"
            >
              Admin view
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
