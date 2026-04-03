"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function SplashIntro({ onComplete }) {
  const [sliderValue, setSliderValue] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const updateTrackWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.clientWidth);
      }
    };

    updateTrackWidth();
    window.addEventListener("resize", updateTrackWidth);
    return () => window.removeEventListener("resize", updateTrackWidth);
  }, []);

  const handleSliderChange = (event) => {
    const nextValue = Number(event.target.value);
    setSliderValue(nextValue);
    if (nextValue >= 95) {
      if (onComplete) {
        onComplete();
      }
    }
  };

  const maxOffset = Math.max(0, trackWidth - 64);
  const handleOffset = Math.round((sliderValue / 100) * maxOffset);

  return (
    <div className="min-h-screen bg-(--background) grid-dark flex flex-col items-center justify-between text-white relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-(--background) to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-(--background) to-transparent pointer-events-none z-10" />

      <header className="w-full flex justify-between items-center px-6 py-8 z-20 animate-fade-up">
        <div className="flex items-center gap-1">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
          Elite Series
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full relative z-20">
        <div className="animate-fade-up delay-100 mb-8 relative">
          <div className="absolute inset-0 rounded-full border border-(--orange) opacity-30 scale-[1.8]" />
          <div className="absolute inset-0 rounded-full border border-(--orange) opacity-10 scale-[2.5]" />
          <div className="w-24 h-24 rounded-full flex items-center justify-center relative z-10">
            <div className="absolute inset-0 bg-(--orange) opacity-20 blur-xl rounded-full" />
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--orange)" className="relative z-10 drop-shadow-[0_0_15px_rgba(255,107,0,0.8)]">
              <path d="M14.5 9.5L19.5 4.5" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="13" r="5" stroke="var(--orange)" strokeWidth="2" fill="none" />
              <path d="M7 17l-4 4" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 4l2 2-2 2-2-2 2-2z" fill="var(--orange)"/>
            </svg>
          </div>
        </div>

        <div className="text-center animate-fade-up delay-200">
          <h1 className="text-display text-6xl md:text-8xl font-black tracking-tight" style={{textShadow: "0 10px 40px rgba(0,0,0,0.5)"}}>
            LOVE <span className="text-(--orange) drop-shadow-[0_0_20px_rgba(255,107,0,0.4)]">ALL</span>
          </h1>
          <p className="mt-6 text-xs md:text-sm font-bold tracking-[0.4em] text-(--orange) uppercase">
            Indoor court booking<br/>platform
          </p>
        </div>
      </main>

      <footer className="w-full max-w-md px-6 pb-12 z-20 animate-fade-up delay-300">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-xs font-semibold text-white/70">System Ready</span>
          <span className="text-xs font-bold text-(--orange) text-shadow-[0_0_10px_rgba(255,107,0,0.5)]">100%</span>
        </div>
        
        <div
          ref={trackRef}
          className="relative w-full h-16 bg-[#0c0c0e] border border-white/5 rounded-full shadow-[0_0_40px_rgba(255,107,0,0.05)] overflow-hidden flex items-center"
        >
          <div 
            className="absolute left-0 top-0 bottom-0 bg-linear-to-r from-transparent to-(--orange-glow) opacity-30 pointer-events-none"
            style={{ width: `${Math.max(10, sliderValue)}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs font-bold tracking-[0.3em] text-(--orange) uppercase opacity-80 pl-10 drop-shadow-[0_0_8px_rgba(255,107,0,0.8)]">
              Swipe to play
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="range-track w-full appearance-none h-full m-0 absolute z-10 opacity-0 cursor-pointer"
          />
          <div 
            className="pointer-events-none absolute left-2 top-2 bottom-2 w-12 h-12 rounded-full bg-(--orange) flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.6)] z-20 transition-transform duration-75"
            style={{ transform: `translateX(${handleOffset}px)` }}
          >
             <ChevronRight className="text-black w-6 h-6 stroke-[3px]" />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">Premium sports experience</span>
          <div className="w-8 h-0.5 bg-(--orange)/50 mt-2 rounded-full" />
        </div>
      </footer>
    </div>
  );
}
