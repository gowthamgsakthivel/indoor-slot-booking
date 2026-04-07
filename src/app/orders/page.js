"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const getCourtImage = (courtLabel) => {
  const match = String(courtLabel || "")
    .toLowerCase()
    .match(/court\s*(\d+)/);
  const courtNumber = match ? Number(match[1]) : 1;
  const safeNumber = Number.isFinite(courtNumber) ? courtNumber : 1;
  const clamped = Math.min(Math.max(safeNumber, 1), 4);
  return `/images/court_${clamped}.png`;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch("/api/orders/me", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Unable to load orders");
        }
        const data = await response.json();
        setOrders(data?.orders || []);
        setStatus("ready");
      } catch (err) {
        setError("Could not load orders.");
        setStatus("error");
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => orders, [orders]);

  return (
    <div className="min-h-screen bg-(--background) text-white grid-dark">
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 pb-28 pt-10">
        <section className="px-1">
          <h1 className="text-display text-3xl font-black tracking-tight">My Orders</h1>
          <p className="mt-2 text-sm text-white/60">
            Manage your recent court bookings and court history.
          </p>
        </section>

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
          <section className="flex flex-col gap-4">
            {filteredOrders.length === 0 ? (
              <p className="text-sm text-white/50">No orders yet.</p>
            ) : (
              filteredOrders.map((order) => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="group flex items-center gap-4 rounded-[26px] border border-white/10 bg-[#131313] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={getCourtImage(order.court)}
                      alt={order.court || "Court"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <span
                        className={`w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          order.status === "Confirmed"
                            ? "bg-[#11301a] text-[#7dff6d]"
                            : order.status === "Completed"
                            ? "bg-white/10 text-white/70"
                            : "bg-[#2b1a1a] text-[#ffb199]"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="text-base font-semibold text-white">
                        {order.court || "Court"}
                      </p>
                      <p className="text-xs text-white/60">
                        {order.slot || new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between gap-3">
                      <div className="min-w-[72px] text-right tabular-nums">
                        <span className="block text-[11px] uppercase tracking-[0.3em] text-(--orange)/70">
                          Rs
                        </span>
                        <span className="text-lg font-semibold text-(--orange)">
                          {order.amount / 100}
                        </span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition group-hover:text-white">
                        <span className="text-base">›</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}
