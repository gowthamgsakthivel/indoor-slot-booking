"use client";

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Edit2, ChevronRight, AlertTriangle, Lock, UserPlus } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const calculateFees = (baseAmount) => {
    const safeBase = Number.isFinite(baseAmount) ? baseAmount : 0;
    const serviceFee = Number((safeBase * 0.02).toFixed(2));
    const tax = Number((safeBase * 0.05).toFixed(2));
    const totalAmount = Number((safeBase + serviceFee + tax).toFixed(2));
    return { baseAmount: safeBase, serviceFee, tax, totalAmount };
  };
  const [profileComplete, setProfileComplete] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState({
    dateLabel: "",
    court: "Court 01",
    slot: "06:00 AM - 07:00 AM",
    duration: "1 hr",
    amount: 500,
    baseAmount: 500,
    serviceFee: 10,
    tax: 25,
    totalAmount: 535,
    members: 1,
    timeSlots: [],
  });
  const timeSlots = Array.isArray(booking.timeSlots) ? booking.timeSlots : [];
  const sortedSlots = [...timeSlots].sort((a, b) => a - b);
  const isContinuousSelection =
    sortedSlots.length > 1 &&
    sortedSlots.every((hour, idx) => idx === 0 || hour === sortedSlots[idx - 1] + 1);
  const maxMembers = isContinuousSelection ? 8 : 6;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch("/api/profile", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        const user = data?.user;
        setProfileComplete(Boolean(user?.name && user?.address));
      } catch (err) {
        setProfileComplete(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    try {
      const loadCart = async () => {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        if (data?.cart) {
          const nextCart = { ...booking, ...data.cart };
          const feeInfo = calculateFees(
            Number.isFinite(nextCart.baseAmount)
              ? nextCart.baseAmount
              : nextCart.amount
          );
          setBooking((prev) => ({
            ...prev,
            ...nextCart,
            ...feeInfo,
          }));
        }
      };

      loadCart();
    } catch (err) {
      setError("Unable to read booking summary.");
    }
  }, []);

  useEffect(() => {
    const existing = document.querySelector("script[data-razorpay]");
    if (existing) {
      setScriptReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "true";
    script.onload = () => setScriptReady(true);
    script.onerror = () => setScriptReady(false);
    document.body.appendChild(script);
  }, []);

  const handlePayNow = async () => {
    setError("");
    if (!profileComplete || !scriptReady || paying) {
      return;
    }
    if (!window.Razorpay) {
      setError("Payment gateway not available.");
      return;
    }

    setPaying(true);
    try {
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: (booking.totalAmount || booking.amount) * 100,
          slot: booking.slot,
          plan: "Booking",
        }),
      });

      if (!orderResponse.ok) {
        throw new Error("Payment order failed");
      }

      const orderData = await orderResponse.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NKL Sports Club",
        description: "Court booking",
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (!verifyResponse.ok) {
            throw new Error("Payment verification failed");
          }

          const verifyData = await verifyResponse.json();
          if (!verifyData.valid) {
            throw new Error("Payment signature invalid");
          }

          await fetch("/api/orders/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: orderData.amount,
              baseAmount: Math.round((booking.baseAmount || booking.amount) * 100),
              serviceFee: Math.round((booking.serviceFee || 0) * 100),
              tax: Math.round((booking.tax || 0) * 100),
              currency: orderData.currency,
              court: booking.court,
              slot: booking.slot,
              duration: booking.duration,
              members: booking.members,
              status: "Confirmed",
            }),
          });

          router.push("/orders");
        },
        theme: {
          color: "#ff6b00",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setPaying(false);
      });
    } catch (err) {
      setError(err?.message || "Payment failed");
      setPaying(false);
    }
  };

  const handleRemove = async () => {
    setError("");
    try {
      const response = await fetch("/api/cart", { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
      setBooking({
        dateLabel: "",
        court: "Court 01",
        slot: "06:00 AM - 07:00 AM",
        duration: "1 hr",
        amount: 0,
        baseAmount: 0,
        serviceFee: 0,
        tax: 0,
        totalAmount: 0,
      });
    } catch (err) {
      setError(err?.message || "Failed to clear cart");
    }
  };

  return (
    <div className="min-h-screen grid-dark bg-(--background) flex flex-col relative pb-32">
      {/* Top Header */}
      <header className="flex items-center px-6 pt-12 pb-4">
        <button className="text-(--orange) p-2 -ml-2" onClick={() => window.history.back()}>
          <ArrowLeft size={24} />
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-(--orange) font-black italic tracking-wider text-xl">KINETIC ONYX</h1>
        </div>
      </header>

      <main className="flex-1 px-6 pt-4 flex flex-col gap-8 mb-20 z-10">
        {/* Title Area */}
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black italic tracking-tight">
            <span className="text-white">REVIEW </span>
            <span className="text-(--orange)">ORDER</span>
          </h1>
          <p className="text-white/50 font-bold text-[11px] tracking-widest uppercase">
            Secure your championship slot
          </p>
        </div>

        {/* Order Details Card */}
        <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
             <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 2v20 M2 12h20 M4.93 4.93l14.14 14.14 M19.07 4.93L4.93 19.07" />
             </svg>
          </div>
          
          <div className="absolute top-6 right-6 w-12 h-12 bg-(--orange)/10 rounded-2xl flex items-center justify-center border border-(--orange)/20 blur-[1px]">
             {/* Racket Icon Mock */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="6"/>
                <path d="m13.2 13.2 5.8 5.8"/>
                <circle cx="17" cy="17" r="1"/>
             </svg>
          </div>

          <div className="relative z-10">
            <p className="text-(--orange) font-bold text-[10px] tracking-widest uppercase mb-2">Selected Arena</p>
            <h2 className="text-white font-black italic text-2xl w-[70%] leading-tight mb-8">
              {booking.court} -<br/>Championship Pro
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <Calendar className="text-white/40 mt-0.5" size={20} />
                <div className="flex flex-col gap-1">
                  <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase">Date</p>
                  <p className="text-white font-semibold text-sm">
                    {booking.dateLabel || "Select date"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-white/40 mt-0.5" size={20} />
                <div className="flex flex-col gap-1">
                  <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase">Time Window</p>
                  <p className="text-white font-semibold text-sm">
                    {booking.slot} ({booking.duration})
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {booking.members} member(s)
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Max {maxMembers} players allowed
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 my-6 w-full" />

            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase">Total Investment</p>
                <p className="text-(--orange) font-black text-4xl">Rs {booking.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors pb-1"
                  onClick={() => router.push("/book")}
                >
                  <span className="font-bold text-[10px] tracking-widest uppercase">Modify</span>
                  <Edit2 size={12} />
                </button>
                <button
                  className="text-[10px] font-bold tracking-widest uppercase text-[#ff7b72]"
                  onClick={handleRemove}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Group */}
        <div className="flex flex-col">
          {/* Add Details Card */}
          <Link href="/cart/details" className="relative group z-20">
            <div className={`border-2 border-dashed rounded-t-3xl rounded-b-xl p-5 flex items-center justify-between shadow-[0_0_20px_rgba(255,107,0,0.05)] transition-all ${
              profileComplete
                ? "bg-[#101410] border-[#2f3a1f]"
                : "bg-[#1a1512] border-(--orange)/30 group-hover:border-(--orange)/50 group-hover:bg-[#1f1915]"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  profileComplete ? "bg-[#1b2d1b] text-(--orange)" : "bg-(--orange)/20 text-(--orange)"
                }`}>
                  <UserPlus size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white font-bold text-base tracking-wide">
                    {profileComplete ? "DETAILS ADDED" : "ADD PERSONAL"}
                    <br />
                    {profileComplete ? "READY TO PAY" : "DETAILS"}
                  </p>
                  {!profileComplete && (
                    <div className="flex items-center gap-1.5 text-[#ff8a8a]">
                      <AlertTriangle size={10} />
                      <span className="font-bold text-[9px] tracking-widest uppercase">Required for booking</span>
                    </div>
                  )}
                  {profileComplete && (
                    <div className="flex items-center gap-1.5 text-[#7cff4f]">
                      <span className="font-bold text-[9px] tracking-widest uppercase">Profile complete</span>
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="text-white/30 group-hover:text-(--orange) transition-colors" size={20} />
            </div>
          </Link>

          {/* Pay Now Button */}
          <div className="bg-[#1a1c23] border border-white/5 rounded-b-3xl p-4 flex flex-col items-center gap-3 -mt-4 pt-8 z-10">
            {error && <p className="text-xs text-[#ff7b72]">{error}</p>}
            <button
              className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-black tracking-widest text-sm uppercase transition-transform ${
                profileComplete && scriptReady && !paying
                  ? "bg-(--orange) text-black hover:scale-[1.01]"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
              onClick={handlePayNow}
              disabled={!profileComplete || !scriptReady || paying}
              type="button"
            >
              {!profileComplete && <Lock size={16} className="text-white/30" />}
              {paying ? "Processing..." : scriptReady ? "Pay Now" : "Loading payment..."}
            </button>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex justify-center my-6">
          <p className="text-white/20 font-bold text-[8px] tracking-[0.2em] uppercase text-center flex items-center gap-2">
            Encrypted Secure Checkout <span className="text-(--orange)">•</span> Kinetic Onyx Verified
          </p>
        </div>
      </main>

    </div>
  );
}
