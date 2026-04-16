"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Contact, ShieldCheck } from "lucide-react";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setName(data?.user?.name || "");
        setDob(data?.user?.dob || "");
        setAddress(data?.user?.address || "");
      } catch (err) {
        setError("Unable to load profile details.");
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async () => {
    setStatus("saving");
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, address }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Save failed");
      }

      setStatus("saved");
      setTimeout(() => {
        setStatus("idle");
        router.push("/cart");
      }, 600);
    } catch (err) {
      setStatus("idle");
      setError(err?.message || "Save failed");
    }
  };

  return (
    <div className="min-h-screen grid-dark bg-(--background) flex flex-col relative pb-0">
      {/* Top Header */}
      <header className="flex flex-col pt-4 pb-4 px-6">
        <div className="flex items-center mb-6">
          <Link href="/cart" className="text-(--orange) p-2 -ml-2">
             <ArrowLeft size={24} />
          </Link>
          <div className="ml-4 flex-1">
             <h1 className="text-(--orange) font-black italic tracking-wider text-xl">KINETIC ONYX</h1>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 relative">
          {/* Background Decorative Element */}
          <div className="absolute -top-10 right-0 p-4 opacity-5 pointer-events-none w-32 h-32">
             <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 50 A50 50 0 0 1 50 0 L100 0 A50 50 0 0 1 50 50 Z" fill="white"/>
                <circle cx="80" cy="80" r="20" fill="white"/>
             </svg>
          </div>

          <h2 className="text-4xl font-black italic tracking-tight leading-tight">
            <span className="text-white block">PERSONAL </span>
            <span className="text-white block">DETAILS</span>
          </h2>
          <p className="text-[#a0a0a0] font-medium text-sm mt-2 w-[85%] leading-relaxed">
            Complete your profile to finalize the court booking.
          </p>
        </div>
      </header>

      <main className="mx-auto flex-1 w-full max-w-4xl px-6 pt-2 flex flex-col gap-6 z-10 xl:max-w-5xl xl:px-10">
        
        {/* Form Group */}
        <div className="flex flex-col gap-5">
            {/* Input Field: Full Name */}
            <div className="flex flex-col gap-2">
                <label className="text-white/50 font-bold text-[9px] tracking-widest uppercase ml-1">Full Name</label>
                <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Full name"
                      className="w-full bg-[#151312] border border-white/5 rounded-2xl p-4 text-white/70 font-medium focus:outline-none focus:border-(--orange)/50 transition-colors pr-12"
                    />
                    <Contact className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                </div>
            </div>

            {/* Input Field: DOB */}
            <div className="flex flex-col gap-2">
                <label className="text-white/50 font-bold text-[9px] tracking-widest uppercase ml-1">Date of Birth</label>
                <div className="relative">
                    <input 
                      type="text" 
                      value={dob}
                      onChange={(event) => setDob(event.target.value)}
                      placeholder="MM / DD / YYYY"
                      className="w-full bg-[#151312] border border-white/5 rounded-2xl p-4 text-white/70 font-medium focus:outline-none focus:border-(--orange)/50 transition-colors pr-12"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                </div>
            </div>

            {/* Input Field: Address */}
            <div className="flex flex-col gap-2">
                <label className="text-white/50 font-bold text-[9px] tracking-widest uppercase ml-1">Address</label>
                <div className="relative">
                    <input 
                      type="text" 
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Street name, City, State, Zip Code"
                      className="w-full bg-[#151312] border border-white/5 rounded-2xl p-4 pb-12 text-white/70 font-medium focus:outline-none focus:border-(--orange)/50 transition-colors pr-12"
                    />
                    <MapPin className="absolute right-4 top-6 text-white/20" size={20} />
                </div>
            </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center my-6 relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full h-px bg-white/5"></div>
            </div>
            <div className="h-2 w-2 rounded-full bg-(--orange)/70 shadow-[0_0_8px_rgba(255,107,0,0.6)] relative z-10"></div>
        </div>

        {/* Security Info Card */}
        <div className="bg-[#12100e] border border-white/5 rounded-2xl p-5 flex gap-4 items-start">
            <div className="min-w-10 min-h-10 rounded-xl bg-[#2a1405] flex items-center justify-center text-(--orange)">
                <ShieldCheck size={20} className="mt-0.5" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col gap-1.5 pt-0.5">
                <h4 className="text-white font-bold text-sm">Data Security</h4>
                <p className="text-[#6c6c6c] text-[11px] leading-relaxed font-medium">
                    Your personal information is encrypted and only used for reservation verification and court entry protocols.
                </p>
            </div>
        </div>

      </main>

      {/* Bottom Action */}
      <div className="mt-auto px-6 pt-6 pb-6">
        {error && (
          <p className="mb-4 text-sm text-[#ff7b72]">{error}</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-(--orange) text-black rounded-2xl py-4 flex items-center justify-center gap-3 font-black text-sm tracking-widest uppercase shadow-[0_4px_30px_rgba(255,107,0,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
          type="button"
          disabled={status === "saving"}
        >
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : "Save & Return to Cart"}
          <ArrowRight size={20} className="stroke-[3px]" />
        </button>
      </div>

    </div>
  );
}
