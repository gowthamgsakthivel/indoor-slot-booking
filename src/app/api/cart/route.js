import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import User from "@/models/User";
import Cart from "@/models/Cart";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const cart = await Cart.findOne({ userId: user._id }).lean();

  if (!cart) {
    return NextResponse.json({ cart: null });
  }

  return NextResponse.json({ cart });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { dateLabel, court, slot, duration, amount, members, timeSlots } = body || {};

  if (!court || !slot || !amount) {
    return NextResponse.json({ error: "Missing booking details" }, { status: 400 });
  }

  const normalizedSlots = Array.isArray(timeSlots) ? timeSlots : [];
  const sortedSlots = [...normalizedSlots].sort((a, b) => a - b);
  const isContinuousSelection =
    sortedSlots.length > 1 &&
    sortedSlots.every((hour, idx) => idx === 0 || hour === sortedSlots[idx - 1] + 1);
  const maxMembers = isContinuousSelection ? 8 : 6;

  if (members && members > maxMembers) {
    return NextResponse.json(
      { error: `Maximum ${maxMembers} players allowed` },
      { status: 400 }
    );
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const cart = await Cart.findOneAndUpdate(
    { userId: user._id },
    { $set: { dateLabel, court, slot, duration, amount, members, timeSlots: normalizedSlots } },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({ cart });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await Cart.deleteOne({ userId: user._id });
  return NextResponse.json({ success: true });
}
