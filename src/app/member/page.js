"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const planDetails = {
  plan: "Monthly",
  price: 1200,
  slot: "6:00-7:00 AM",
};

const liveAvailability = [
  { slot: "6-7", status: "Full", tone: "bg-[#2b1a1a] text-[#ff7b72]" },
  { slot: "7-8", status: "Available", tone: "bg-[#1b2d1b] text-(--orange)" },
  { slot: "8-9", status: "Few slots", tone: "bg-[#1c1c1c] text-white/70" },
];

export default function MemberPage() {
  const [status, setStatus] = useState("loading");
  const [membership, setMembership] = useState(null);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const loadMembership = async () => {
    setError("");
    setStatus("loading");
    try {
      const response = await fetch("/api/membership/me", { cache: "no-store" });
      if (response.status === 404) {
        setStatus("none");
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to load membership");
      }
      const data = await response.json();
      const nextMembership = data?.membership || null;
      setMembership(nextMembership);

      if (nextMembership?.groupId) {
        const groupResponse = await fetch(`/api/groups/${nextMembership.groupId}`);
        if (groupResponse.ok) {
          const groupData = await groupResponse.json();
          setGroup(groupData.group || null);
        }
      }

      if (nextMembership?.status === "expired" || nextMembership?.isExpired) {
        setStatus("expired");
      } else {
        setStatus("active");
      }
    } catch (err) {
      setError("Could not load membership details.");
      setStatus("error");
    }
  };

  useEffect(() => {
    loadMembership();
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

  const handleJoin = async () => {
    setJoining(true);
    setError("");
    try {
      if (!scriptReady) {
        throw new Error("Payment gateway not ready");
      }
      if (!window.Razorpay) {
        throw new Error("Razorpay checkout not available");
      }
      const available = await fetch("/api/groups/available?slot=6-7");
      if (!available.ok) {
        throw new Error("No group available");
      }
      const groupData = await available.json();
      const availableGroup = groupData.group;

      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: planDetails.price * 100,
          slot: "6-7",
          plan: planDetails.plan,
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
        description: "Membership payment",
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

          const joinResponse = await fetch("/api/membership/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slot: "6-7",
              groupId: availableGroup._id,
              plan: planDetails.plan,
              price: planDetails.price,
            }),
          });

          if (!joinResponse.ok) {
            const message = await joinResponse.json();
            throw new Error(message?.error || "Unable to join membership");
          }

          await loadMembership();
          setJoining(false);
        },
        theme: {
          color: "#ff6b00",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", () => {
        setError("Payment failed. Please try again.");
        setJoining(false);
      });
    } catch (err) {
      setError(err?.message || "Join failed");
      setStatus("none");
    }
  };

  const activityStats = [
    { label: "Days played", value: 18, tone: "text-(--orange)" },
    { label: "Days missed", value: 4, tone: "text-white/70" },
  ];

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-6 pt-6 xl:max-w-5xl xl:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Member hub
            </p>
            <h1 className="text-display text-3xl font-black mt-2">
              Your Membership
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Manage your court access, group, and activity.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
          >
            Back home
          </Link>
        </header>

        {status === "loading" && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-white/70">Loading membership...</p>
          </section>
        )}

        {status === "error" && (
          <section className="rounded-3xl border border-white/10 bg-[#2b1a1a] p-6">
            <p className="text-sm text-[#ff7b72]">{error}</p>
          </section>
        )}

        {(status === "none" || status === "expired") && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {status === "expired" ? "Membership expired" : "No membership"}
                </p>
                <h2 className="text-display mt-2 text-2xl font-semibold">
                  Join the 6:00-7:00 AM slot
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Monthly ₹{planDetails.price} · Court assigned on availability.
                </p>
              </div>
              <button
                className="rounded-full bg-(--orange) px-5 py-2 text-xs font-semibold text-black"
                onClick={handleJoin}
                disabled={joining || !scriptReady}
              >
                {joining ? "Joining..." : scriptReady ? "Join now" : "Loading payment..."}
              </button>
            </div>
          </section>
        )}

        {status === "active" && membership && (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                    Membership card
                  </p>
                  <h2 className="text-display mt-2 text-2xl font-semibold">
                    {membership.plan} · ₹{membership.price}
                  </h2>
                </div>
                <span className="rounded-full bg-[#1b2d1b] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-(--orange)">
                  Active
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
                  <p className="text-xs text-white/50">Slot</p>
                  <p className="mt-2 text-sm font-semibold">{membership.slot}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
                  <p className="text-xs text-white/50">Court</p>
                  <p className="mt-2 text-sm font-semibold">Court {membership.courtId}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
                  <p className="text-xs text-white/50">Renewal</p>
                  <p className="mt-2 text-sm font-semibold">
                    {new Date(membership.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Group members
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {group?.members?.length ? (
                    group.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-3 rounded-full border border-white/10 bg-[#141414] px-3 py-2"
                      >
                        <div className="h-8 w-8 rounded-full bg-[#1c1c1c] flex items-center justify-center text-xs font-semibold">
                          {member.name?.slice(0, 1) || "M"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{member.name || "Member"}</p>
                          <p className="text-[10px] text-white/40">{member.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-white/40">No members loaded.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Activity
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {activityStats.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-4"
                    >
                      <p className="text-xs text-white/50">{item.label}</p>
                      <p className={`text-lg font-semibold ${item.tone}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Live availability
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {liveAvailability.map((slot) => (
                    <div
                      key={slot.slot}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#141414] px-4 py-4"
                    >
                      <p className="text-sm font-semibold">{slot.slot} AM</p>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${slot.tone}`}>
                        {slot.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
