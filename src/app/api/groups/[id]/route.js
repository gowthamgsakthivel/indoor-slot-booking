import { NextResponse } from "next/server";
import connectMongoose from "@/lib/mongoose";
import Group from "@/models/Group";
import User from "@/models/User";
import Membership from "@/models/Membership";

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

export async function PATCH(request, { params }) {
  const body = await request.json();
  const {
    name,
    court,
    time,
    maxMembers,
    members,
    addMemberIds,
    removeMemberIds,
  } = body || {};

  await connectMongoose();

  const group = await Group.findById(params.id);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const previousMembers = group.members.map((memberId) => memberId.toString());
  const shouldSyncCourtOrTime = Boolean(court || time);

  if (name) group.name = name;
  if (court) group.court = court;
  if (time) group.time = time;
  if (typeof maxMembers === "number") {
    group.maxMembers = maxMembers;
    group.capacity = maxMembers;
  }

  if (Array.isArray(members)) {
    group.members = members;
  }

  if (Array.isArray(addMemberIds) && addMemberIds.length > 0) {
    addMemberIds.forEach((memberId) => {
      if (!group.members.some((id) => id.toString() === memberId)) {
        group.members.push(memberId);
      }
    });
  }

  if (Array.isArray(removeMemberIds) && removeMemberIds.length > 0) {
    group.members = group.members.filter(
      (id) => !removeMemberIds.some((removeId) => removeId === id.toString())
    );
  }

  await group.save();

  const updatedMembers = group.members.map((memberId) => memberId.toString());
  const addedMembers = updatedMembers.filter(
    (memberId) => !previousMembers.includes(memberId)
  );
  const removedMembers = previousMembers.filter(
    (memberId) => !updatedMembers.includes(memberId)
  );
  const now = new Date();

  if (addedMembers.length > 0) {
    await Membership.updateMany(
      { userId: { $in: addedMembers }, endDate: { $gte: now } },
      {
        $set: {
          groupId: group._id,
          slot: group.time || "Unassigned",
          courtId: group.courtId || 0,
        },
      }
    );
  }

  if (removedMembers.length > 0) {
    await Membership.updateMany(
      {
        userId: { $in: removedMembers },
        groupId: group._id,
        endDate: { $gte: now },
      },
      { $set: { groupId: null, slot: "Unassigned", courtId: 0 } }
    );
  }

  if (shouldSyncCourtOrTime && updatedMembers.length > 0) {
    await Membership.updateMany(
      {
        userId: { $in: updatedMembers },
        groupId: group._id,
        endDate: { $gte: now },
      },
      { $set: { slot: group.time || "Unassigned", courtId: group.courtId || 0 } }
    );
  }

  return NextResponse.json({ group });
}

export async function DELETE(request, { params }) {
  await connectMongoose();

  const group = await Group.findByIdAndDelete(params.id);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
