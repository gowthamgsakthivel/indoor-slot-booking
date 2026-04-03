import { NextResponse } from "next/server";
import connectMongoose from "@/lib/mongoose";
import Group from "@/models/Group";
import User from "@/models/User";

export async function GET(request, { params }) {
  await connectMongoose();

  const group = await Group.findById(params.id).lean();
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const members = await User.find({ _id: { $in: group.members } })
    .select("name email")
    .lean();

  return NextResponse.json({
    group: {
      ...group,
      members,
    },
  });
}
