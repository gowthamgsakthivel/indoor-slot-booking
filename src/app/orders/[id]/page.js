import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import OrderQRCode from "@/components/OrderQRCode";

export default async function OrderDetailPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    notFound();
  }

  const order = await Order.findOne({ _id: params.id, userId: user._id }).lean();
  if (!order) {
    notFound();
  }

  const qrPayload = JSON.stringify({
    orderId: order.orderId,
    court: order.court,
    slot: order.slot,
    date: order.createdAt,
    amount: order.amount,
  });

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-24 pt-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Order details
            </p>
            <h1 className="text-display text-3xl font-black mt-2" title={order.orderId}>
              #{order.orderId.slice(-6).toUpperCase()}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <Link
            href="/orders"
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
          >
            Back to orders
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Court</p>
              <p className="mt-2 text-sm font-semibold">{order.court}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Slot</p>
              <p className="mt-2 text-sm font-semibold">{order.slot || "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Duration</p>
              <p className="mt-2 text-sm font-semibold">{order.duration}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Players</p>
              <p className="mt-2 text-sm font-semibold">{order.members || 1}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Status</p>
              <p className="mt-2 text-sm font-semibold">{order.status}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Payment ID</p>
              <p className="mt-2 text-sm font-semibold">{order.paymentId || "Pending"}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Amount</p>
              <p className="mt-2 text-sm font-semibold">Rs {order.amount / 100}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Currency</p>
              <p className="mt-2 text-sm font-semibold">{order.currency}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#141414] px-4 py-4">
              <p className="text-xs text-white/50">Order reference</p>
              <p className="mt-2 text-sm font-semibold">{order.orderId}</p>
            </div>
          </div>
          </div>
          <OrderQRCode payload={qrPayload} />
        </section>
      </main>
    </div>
  );
}
