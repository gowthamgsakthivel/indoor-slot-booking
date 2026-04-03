import { NextResponse } from "next/server";
import connectMongoose from "@/lib/mongoose";
import Group from "@/models/Group";

export async function GET() {
  await connectMongoose();
  const groups = await Group.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ groups });
}

export async function POST(request) {
  const body = await request.json();
  const { name, court, time, maxMembers, level } = body || {};

  if (!name) {
    return NextResponse.json({ error: "Group name is required" }, { status: 400 });
  }

  const normalizedCourt = court || "Court 1";
  const courtIdMatch = normalizedCourt.match(/\d+/);
  const courtId = courtIdMatch ? Number(courtIdMatch[0]) : 1;
  const slot = time || "06:00 AM - 07:00 AM";
  const capacity = Number(maxMembers) || 6;

  await connectMongoose();

  const group = await Group.create({
    name,
    court: normalizedCourt,
    time: slot,
    maxMembers: capacity,
    level,
    courtId,
    slot,
    capacity,
    members: [],
  });

  return NextResponse.json({ group }, { status: 201 });
}
