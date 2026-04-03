"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

const days = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"];
const courts = [1, 2, 3, 4];

const timeCategories = [
  { name: 'Twilight', range: [0, 5] },
  { name: 'Morning', range: [6, 11] },
  { name: 'Noon', range: [12, 17] },
  { name: 'Evening', range: [18, 23] }
];

const allHours = Array.from({ length: 24 }, (_, i) => {
  const isAm = i < 12;
  const hour = i === 0 ? 12 : (i > 12 ? i - 12 : i);
  return { id: i, label: `${hour} ${isAm ? 'am' : 'pm'}` };
});

export default function BookPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [memberCount, setMemberCount] = useState(1);
  const sortedHours = [...selectedTimes].sort((a, b) => a - b);
  const isContinuousSelection =
    sortedHours.length > 1 &&
    sortedHours.every((hour, idx) => idx === 0 || hour === sortedHours[idx - 1] + 1);
  const maxMembers = isContinuousSelection ? 8 : 6;

  useEffect(() => {
    setMemberCount((prev) => Math.min(prev, maxMembers));
  }, [maxMembers]);

  const handleAddToCart = async () => {
    if (!selectedCourt || selectedTimes.length === 0) {
      return;
    }

    const first = sortedHours[0];
    const last = sortedHours[sortedHours.length - 1];
    const startLabel = allHours.find((hour) => hour.id === first)?.label || "";
    const endLabel = allHours.find((hour) => hour.id === last + 1)?.label || "";
    const duration = `${selectedTimes.length} hr${selectedTimes.length > 1 ? "s" : ""}`;

    const cartData = {
      dateLabel: selectedDate,
      court: `Court ${selectedCourt}`,
      slot: endLabel ? `${startLabel} - ${endLabel}` : startLabel,
      duration,
      amount: totalPrice,
      members: memberCount,
      timeSlots: sortedHours,
    };

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartData),
    });

    if (response.ok) {
      router.push("/cart");
    }
  };

  const toggleTime = (hourId) => {
    setSelectedTimes(prev =>
      prev.includes(hourId)
        ? prev.filter(id => id !== hourId)
        : [...prev, hourId]
    );
  };

  const totalPrice = selectedTimes.length * 250;
  const selectedTimeLabels = sortedHours
    .map((id) => allHours.find((hour) => hour.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-(--background) font-sans text-white pb-36 grid-dark relative selection:bg-(--orange) selection:text-black">

      {/* 1. Immersive Hero Image Header */}
      <div className="relative w-full h-[30vh] min-h-62.5 overflow-hidden">
        <Image
          src="/images/court1.png"
          alt="Arena Background"
          fill
          priority
          className="object-cover scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#0c0c0e]/60 via-[#0c0c0e]/80 to-(--background)" />

        <div className="absolute inset-0 px-6 pt-12 flex flex-col items-start z-10">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors mb-6 shadow-xl">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </Link>
          <h1 className="text-display text-4xl sm:text-5xl font-black tracking-tight" style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}>
            Reserve Your<br />
            <span className="text-(--orange) italic drop-shadow-[0_0_20px_rgba(255,107,0,0.4)] block -mt-1">Court</span>
          </h1>
        </div>
      </div>

      <main className="w-full max-w-4xl mx-auto px-6 relative z-10 -mt-2">

        <p className="text-white/60 text-sm font-medium mb-8 max-w-sm">
          Select your date, pick your hours, and reserve your synthetic court instantly.
        </p>

        {/* 2. Horizontal Date Scroller */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">1. Pick a Date</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x -mx-6 px-6 relative pointer-events-auto">
            {days.map((day) => {
              const isActive = selectedDate === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`snap-center min-w-20 flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all duration-300
                    ${isActive 
                      ? "bg-(--orange) border-(--orange) shadow-[0_5px_15px_rgba(255,107,0,0.3)] text-black" 
                      : "bg-[#141414] border-white/5 text-white/50 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest">{day}</span>
                  {isActive && <div className="w-1 h-1 rounded-full bg-black mt-1.5 opacity-50" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. 24/7 Segmented Timeline */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">2. Select Hours</h2>
            <div className="inline-flex items-center rounded-full border border-(--orange)/30 bg-(--orange)/10 px-3 py-1">
              <span className="text-[9px] font-bold tracking-[0.2em] text-(--orange) uppercase">24/7 Access</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full pb-6 relative pointer-events-auto">
            {timeCategories.map(cat => (
              <div key={cat.name} className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-(--orange)">{cat.name}</span>
                </div>
                
                <div className="grid grid-cols-6 border border-white/10 bg-[#121212] rounded-2xl overflow-hidden shadow-xl hover:border-white/20 transition-colors w-full">
                  {allHours.slice(cat.range[0], cat.range[1] + 1).map(hour => {
                      const isSelected = selectedTimes.includes(hour.id);
                      return (
                        <button 
                            key={hour.id} 
                            onClick={() => toggleTime(hour.id)}
                            className={`flex items-center justify-center p-2 sm:py-4 transition-all border-r border-white/5 last:border-0 relative
                              ${isSelected ? 'bg-(--orange) text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                        >
                            {isSelected && <div className="absolute inset-0 bg-white opacity-20 pointer-events-none" />}
                            <div className="relative z-10 flex flex-col items-center">
                               <span className="text-[11px] sm:text-sm font-black">{hour.label.split(' ')[0]}</span>
                               <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-80">{hour.label.split(' ')[1]}</span>
                            </div>
                        </button>
                      )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Available Courts Picker */}
        {selectedTimes.length > 0 && (
          <section className="mb-10 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">3. Choose Court</h2>
              <button
                className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white"
                onClick={() => setSelectedTimes([])}
                type="button"
              >
                Clear times
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {courts.map(c => {
              const isSelected = selectedCourt === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCourt(c)}
                  className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group
                    ${isSelected
                      ? 'border-(--orange) bg-[#1c140d] shadow-[0_0_30px_rgba(255,107,0,0.15)] scale-[1.02]'
                      : 'border-white/5 bg-[#141414] hover:bg-white/5 hover:border-white/20'
                    }`}
                >
                  {isSelected && <div className="absolute -top-10 -right-10 w-24 h-24 bg-(--orange) opacity-20 blur-2xl rounded-full" />}

                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 transition-colors
                      ${isSelected ? 'bg-(--orange) text-black' : 'bg-[#1c140d] border border-(--orange)/30 text-(--orange)'}`}>
                      <span className="font-black text-xl">{c}</span>
                    </div>
                    <span className="font-bold text-base text-white">Court {c}</span>
                    <span className={`text-[9px] uppercase font-bold tracking-[0.2em] 
                      ${isSelected ? 'text-(--orange)' : 'text-white/40 group-hover:text-white/60'}`}>
                      Synthetic
                    </span>
                  </div>
                </button>
              )
            })}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Booking summary
                </p>
                <p className="mt-2 text-lg font-semibold">{selectedDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Selected</p>
                <p className="mt-2 text-sm font-semibold">
                  {selectedTimes.length} hrs • Court {selectedCourt || "-"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTimeLabels.length > 0 ? (
                selectedTimeLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/10 bg-[#141414] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    {label}
                  </span>
                ))
              ) : (
                <span className="text-xs text-white/40">Select hours to see summary.</span>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Players</p>
                <p className="mt-1 text-sm font-semibold">{memberCount} member(s)</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Max {maxMembers} players
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:text-white"
                  onClick={() => setMemberCount((prev) => Math.max(1, prev - 1))}
                  type="button"
                >
                  -
                </button>
                <span className="min-w-8 text-center text-sm font-semibold">{memberCount}</span>
                <button
                  className="h-9 w-9 rounded-full border border-white/10 text-white/70 hover:text-white"
                  onClick={() => setMemberCount((prev) => Math.min(maxMembers, prev + 1))}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 5. Fixed Checkout / Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0c0c0e]/95 backdrop-blur-2xl border-t border-white/10 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] animate-fade-up">
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <p className="text-white/50 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1">
              {selectedTimes.length} hrs • Court {selectedCourt || '-'}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-3xl font-black text-white">Rs {totalPrice}</span>
              {totalPrice > 0 && <span className="text-xs text-(--orange) font-bold">Total</span>}
            </div>
          </div>

          <button 
             onClick={handleAddToCart}
             disabled={selectedTimes.length === 0 || !selectedCourt}
             className={`px-8 sm:px-12 py-4 sm:py-5 rounded-full font-black text-sm sm:text-base uppercase tracking-widest transition-all duration-300 flex items-center justify-center min-w-42.5 sm:min-w-52.5 gap-3 group
               ${selectedTimes.length > 0 && selectedCourt 
                 ? 'bg-(--orange) text-black shadow-[0_10px_30px_rgba(255,107,0,0.4)] hover:scale-105 hover:bg-white active:scale-95' 
                 : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
               }`}
          >
            Add to cart
            {selectedTimes.length > 0 && selectedCourt && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="-mr-2 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
