import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import User from "@/models/User";
import Membership from "@/models/Membership";

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

  const membership = await Membership.findOne({ userId: user._id })
    .sort({ endDate: -1 })
    .lean();

  if (!membership) {
    return NextResponse.json({ error: "No membership" }, { status: 404 });
  }

  const isExpired = new Date(membership.endDate) < new Date();

  return NextResponse.json({
    membership: {
      ...membership,
      status: isExpired ? "expired" : membership.status,
      isExpired,
    },
  });
}
