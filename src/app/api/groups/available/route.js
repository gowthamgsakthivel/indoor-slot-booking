import { NextResponse } from "next/server";
import connectMongoose from "@/lib/mongoose";
import Group from "@/models/Group";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slot = searchParams.get("slot");

  if (!slot) {
    return NextResponse.json({ error: "Missing slot" }, { status: 400 });
  }

  await connectMongoose();

  let group = await Group.findOne({
    slot,
    $expr: { $lt: [{ $size: "$members" }, "$capacity"] },
  }).lean();

  if (!group) {
    group = await Group.create({
      slot,
      courtId: 1,
      members: [],
      capacity: 6,
    });
  }

  return NextResponse.json({ group });
}
