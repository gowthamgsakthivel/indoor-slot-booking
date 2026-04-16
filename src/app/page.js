"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Calendar } from "lucide-react";
import SplashIntro from "@/components/SplashIntro";

export default function Home() {
  const viewState = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") {
        return () => {};
      }
      const handler = () => callback();
      window.addEventListener("introchange", handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("introchange", handler);
        window.removeEventListener("storage", handler);
      };
    },
    () => {
      if (typeof window === "undefined") {
        return "loading";
      }
      return sessionStorage.getItem("hasSeenIntro") ? "home" : "splash";
    },
    () => "loading"
  );

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true");
    window.dispatchEvent(new Event("introchange"));
  };

  if (viewState === "loading") {
    return <div className="min-h-screen bg-(--background)" />;
  }

  if (viewState === "splash") {
    return <SplashIntro onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-(--background) flex flex-col text-white pb-0 font-sans relative">
      <div className="absolute top-0 inset-x-0 h-[60vh] court-hero-gradient pointer-events-none opacity-80" />
      <div className="absolute top-0 inset-x-0 h-[60vh] grid-dark pointer-events-none opacity-40 mix-blend-overlay" />
      <div className="absolute top-[40vh] inset-x-0 h-[30vh] bg-linear-to-b from-transparent to-(--background) pointer-events-none" />

      <main className="flex-1 px-4 sm:px-6 w-full max-w-4xl mx-auto relative z-10 flex flex-col pt-4 pb-0 xl:max-w-6xl xl:px-10">
        <div className="self-center md:self-start">
          <div className="inline-flex items-center rounded-full border border-(--orange)/40 bg-(--orange)/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(255,107,0,0.15)]">
            <span className="text-[10px] font-bold tracking-[0.2em] text-(--orange) uppercase">
              Open Now • Until 11 PM
            </span>
          </div>
        </div>

        <h1 className="text-display mt-8 text-[3.25rem] leading-[1.05] font-black sm:text-[3.5rem] md:text-7xl">
          Book Your <br />
          <span className="text-(--orange) italic drop-shadow-[0_0_20px_rgba(255,107,0,0.4)] block -ml-2">Court</span>
          Instantly
        </h1>

        <p className="mt-4 text-sm md:text-base font-medium text-white/60 leading-relaxed max-w-sm lg:max-w-md">
          4 Premium Indoor Synthetic Courts Available for Professional and Casual Play.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:gap-4">
          <Link href="/book" className="w-full flex justify-center items-center gap-2 bg-(--orange) text-black font-bold text-lg py-4 rounded-2xl shadow-[0_10px_30px_rgba(255,107,0,0.3)] hover:scale-[1.02] transition-transform">
            <Calendar size={20} strokeWidth={2.5} />
            Book a Court
          </Link>
          <button className="w-full bg-white/5 border border-white/10 text-white font-semibold text-base py-4 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
            View Prices
          </button>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Live Status</h2>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--orange) opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-(--orange)"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Auto-updating</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[1, 2, 3, 4].map((courtNum) => {
              const isAvailable = courtNum === 1 || courtNum === 3;
              return (
                <div key={courtNum} className={`p-4 rounded-3xl border ${isAvailable ? 'bg-[#1c140d] border-(--orange)/30 shadow-[0_0_20px_rgba(255,107,0,0.1)]' : 'bg-[#141414] border-white/5'} flex flex-col justify-between h-28 relative overflow-hidden transition-all duration-300`}>
                  {isAvailable && <div className="absolute top-0 right-0 w-16 h-16 bg-(--orange) opacity-10 blur-xl rounded-full" />}
                  <span className="font-bold text-lg text-white/90">Court {courtNum}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-(--orange) shadow-[0_0_8px_rgba(255,107,0,1)]' : 'bg-white/20'}`} />
                    <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase ${isAvailable ? 'text-(--orange)' : 'text-white/40'}`}>
                      {isAvailable ? 'Available' : 'In Progress'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">The Arena</h2>
            <button className="text-(--orange) text-[10px] font-bold tracking-[0.2em] uppercase hover:underline">View All</button>
          </div>
          <div className="flex gap-4 sm:gap-5 mt-6 overflow-x-auto pb-6 no-scrollbar snap-x">
            <div className="min-w-[85%] sm:min-w-70 aspect-square sm:h-85 rounded-4xl snap-center relative overflow-hidden shadow-2xl border border-white/5 bg-[#141414]">
              <Image
                src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Badminton Shuttlecock"
                fill
                sizes="(max-width: 768px) 220px, 320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e] via-[rgba(12,12,14,0.4)] to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 pr-6">
                <p className="font-bold text-xl text-white">Pro Gear</p>
                <p className="text-[10px] text-(--orange) mt-1 tracking-[0.2em] font-bold uppercase">Ready to smash</p>
              </div>
            </div>

            <div className="min-w-[85%] sm:min-w-70 aspect-square sm:h-85 rounded-4xl snap-center relative overflow-hidden shadow-2xl border border-white/5 bg-[#141414]">
              <Image
                src="/images/court1.png"
                alt="Arena Court"
                fill
                sizes="(max-width: 768px) 220px, 320px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e] via-[rgba(12,12,14,0.4)] to-transparent opacity-90" />
              <div className="absolute bottom-6 left-6 pr-6">
                <p className="font-bold text-xl text-white">Elite Standard</p>
                <p className="text-[10px] text-(--orange) mt-1 tracking-[0.2em] font-bold uppercase">Modern Synthetic</p>
              </div>
            </div>

            <div className="min-w-[85%] sm:min-w-70 aspect-square sm:h-85 rounded-4xl snap-center relative overflow-hidden shadow-2xl border border-(--orange)/30 bg-[#1c140d] flex items-center justify-center cursor-pointer group hover:bg-[#251a11] transition-colors">
              <div className="absolute inset-0 bg-linear-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
              <div className="text-center relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-(--orange) flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)] group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
                <p className="text-white/80 font-bold tracking-widest mt-2">See full gallery</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 mb-6">
          <div className="w-full min-h-[260px] rounded-[2.5rem] bg-[#121212] border border-white/10 relative overflow-hidden p-6 flex flex-col justify-end shadow-2xl group cursor-pointer hover:border-(--orange)/40 transition-colors sm:min-h-[280px] sm:p-8">
            <div className="absolute inset-0 grid-dark opacity-40 mix-blend-overlay pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-(--orange) opacity-10 blur-[50px] rounded-full group-hover:opacity-20 transition-opacity" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#1c140d] rounded-full border border-(--orange)/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,107,0,0.15)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_6px_rgba(255,107,0,0.6)]">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <h3 className="text-3xl font-black text-white leading-tight tracking-tight">Downtown Arena</h3>
              <p className="text-white/50 font-medium text-[13px] mt-2 max-w-[80%]">123 Smash Boulevard, Elite District, CA 90210</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
