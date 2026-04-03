import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { orderId, paymentId, amount, currency, court, slot, duration, status, members } = body || {};

  if (!orderId || !amount) {
    return NextResponse.json({ error: "Missing order details" }, { status: 400 });
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const order = await Order.create({
    userId: user._id,
    orderId,
    paymentId,
    amount,
    currency: currency || "INR",
    court,
    slot,
    duration,
    status: status || "Confirmed",
    members: members || 1,
  });

  return NextResponse.json({ order });
}
