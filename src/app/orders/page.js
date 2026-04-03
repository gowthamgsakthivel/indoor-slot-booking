"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/orders/me", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load orders");
        }
        const data = await response.json();
        setOrders(data?.orders || []);
        setUserName(data?.userName || "");
        setStatus("ready");
      } catch (err) {
        setError("Could not load orders.");
        setStatus("error");
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-24 pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Orders
            </p>
            <h1 className="text-display text-3xl font-black mt-2">
              Past bookings
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Review previous reservations and payment status.
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
            <p className="text-sm text-white/70">Loading orders...</p>
          </section>
        )}

        {status === "error" && (
          <section className="rounded-3xl border border-white/10 bg-[#2b1a1a] p-6">
            <p className="text-sm text-[#ff7b72]">{error}</p>
          </section>
        )}

        {status === "ready" && (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-display text-lg font-semibold">Recent orders</h2>
              <span className="text-xs text-white/50">{orders.length} total</span>
            </div>
            {orders.length === 0 ? (
              <p className="mt-4 text-sm text-white/50">No orders yet.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#141414] px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {userName || "Member"}
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-xs text-white/50">{order.duration}</div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        order.status === "Confirmed"
                          ? "bg-[#1b2d1b] text-(--orange)"
                          : order.status === "Completed"
                          ? "bg-[#1c1c1c] text-white/70"
                          : "bg-[#2b1a1a] text-[#ff7b72]"
                      }`}
                    >
                      {order.status}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white/80">
                        Rs {order.amount / 100}
                      </span>
                      <Link
                        className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white"
                        href={`/orders/${order._id}`}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
