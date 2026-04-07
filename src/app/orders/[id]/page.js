import Link from "next/link";
import { ArrowLeft, Bell, Activity, Download } from "lucide-react";
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

  const createdAt = new Date(order.createdAt);
  const dateLabel = createdAt.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
  const timeLabel = createdAt.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formatAmount = (value) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const amountValue = order.amount / 100;
  const baseAmountValue = (order.baseAmount ?? order.amount) / 100;
  const serviceFeeValue = (order.serviceFee ?? 0) / 100;
  const taxValue = (order.tax ?? 0) / 100;
  const formattedAmount = formatAmount(amountValue);
  const formattedBaseAmount = formatAmount(baseAmountValue);
  const formattedServiceFee = formatAmount(serviceFeeValue);
  const formattedTax = formatAmount(taxValue);
  const statusLabel = order.status || "Confirmed";
  const statusClasses =
    statusLabel === "Confirmed"
      ? "bg-[#10351b] text-[#7dff6d]"
      : statusLabel === "Completed"
      ? "bg-white/10 text-white/70"
      : "bg-[#3a1f1f] text-[#ff7b72]";

  return (
    <div className="min-h-screen bg-(--background) text-white overflow-x-hidden">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 pb-28 pt-6">
        <header className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:text-white"
              aria-label="Back to orders"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-(--orange)">
                Order details
              </p>
              <p className="text-[11px] text-white/60">#{order.orderId.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={2.5} />
            </button>
            <div className="h-10 w-10 rounded-full border border-white/10 bg-linear-to-br from-white/40 to-white/10" />
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40">
          <img
            src="/images/my-orderimg.png"
            alt="Badminton court"
            className="h-60 w-full object-cover sm:h-72"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-(--orange)">
                Venue
              </p>
              <h1 className="text-display text-3xl font-black leading-tight sm:text-4xl">
                Championship
                <br />
                Pro
              </h1>
            </div>
            <span
              className={`rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] sm:px-4 sm:tracking-[0.25em] whitespace-nowrap ${statusClasses}`}
            >
              {statusLabel}
            </span>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Booking ID</p>
            <p className="mt-3 text-lg font-semibold">#{order.orderId.slice(-6).toUpperCase()}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Court No.</p>
            <p className="mt-3 text-lg font-semibold">{order.court || "Court"}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Players</p>
            <p className="mt-3 text-lg font-semibold">{order.members || 1}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Payment ID</p>
            <p className="mt-3 text-sm font-semibold break-all text-white/80">
              {order.paymentId || "Pending"}
            </p>
          </div>
          <div className="col-span-2 rounded-3xl border border-white/10 bg-linear-to-br from-[#1b120b] via-[#1a1410] to-[#141414] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Date & time</p>
              <span className="rounded-full bg-(--orange) px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                {order.duration || "Session"}
              </span>
            </div>
            <p className="mt-3 text-base font-semibold text-white">{dateLabel}</p>
            <p className="text-xs text-white/70">
              {order.slot || timeLabel}
            </p>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <p className="text-center text-xs uppercase tracking-[0.35em] text-white/50">
            Scan at entrance
          </p>
          <div className="mt-5 flex justify-center">
            <OrderQRCode
              payload={qrPayload}
              size={200}
              label=""
              className="border-none bg-transparent p-0"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.35em] text-(--orange)">
            <Activity size={16} strokeWidth={2.5} />
            <span>Kinetic pass active</span>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Pricing breakdown</p>
            <span className="text-xs text-white/60">{order.currency}</span>
          </div>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between text-white/70">
              <span>Court Rental</span>
              <span>Rs {formattedBaseAmount}</span>
            </div>
            <div className="flex items-center justify-between text-white/50">
              <span>Service fee</span>
              <span>Rs {formattedServiceFee}</span>
            </div>
            <div className="flex items-center justify-between text-white/50">
              <span>Tax</span>
              <span>Rs {formattedTax}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold">
              <span>Total</span>
              <span>Rs {formattedAmount}</span>
            </div>
          </div>
        </section>

        <a
          href={`/api/orders/${params.id}/receipt`}
          className="flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:text-white"
        >
          <Download size={16} strokeWidth={2.5} />
          Download receipt
        </a>
      </main>
    </div>
  );
}
