import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import User from "@/models/User";
import Group from "@/models/Group";
import Membership from "@/models/Membership";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { slot, groupId, plan, price } = body || {};

  if (!slot || !groupId || !plan || !price) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await Membership.findOne({ userId: user._id, status: "active" });
  if (existing) {
    return NextResponse.json({ error: "Membership already active" }, { status: 409 });
  }

  const group = await Group.findById(groupId);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  if (group.members.length >= group.capacity) {
    return NextResponse.json({ error: "Group is full" }, { status: 409 });
  }

  if (!group.members.some((member) => member.toString() === user._id.toString())) {
    group.members.push(user._id);
    await group.save();
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  const membership = await Membership.create({
    userId: user._id,
    plan,
    price,
    startDate,
    endDate,
    slot,
    courtId: group.courtId,
    groupId: group._id,
    status: "active",
  });

  return NextResponse.json({ membership });
}
