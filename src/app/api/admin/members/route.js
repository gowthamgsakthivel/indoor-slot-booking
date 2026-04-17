import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import Membership from "@/models/Membership";
import User from "@/models/User";
import Group from "@/models/Group";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectMongoose();

  const now = new Date();
  const memberships = await Membership.find({})
    .sort({ endDate: -1 })
    .lean();

  const userIds = memberships.map((membership) => membership.userId);
  const users = await User.find({ _id: { $in: userIds } })
    .select("name email phone")
    .lean();

  const groupIds = memberships
    .map((membership) => membership.groupId)
    .filter(Boolean);
  const groups = await Group.find({ _id: { $in: groupIds } })
    .select("name court time")
    .lean();

  const userMap = users.reduce((acc, user) => {
    acc[user._id.toString()] = user;
    return acc;
  }, {});

  const groupMap = groups.reduce((acc, group) => {
    acc[group._id.toString()] = group;
    return acc;
  }, {});

  const unique = {};
  memberships.forEach((membership) => {
    const id = membership.userId.toString();
    if (!unique[id]) {
      unique[id] = membership;
    }
  });

  const members = Object.values(unique).map((membership) => {
    const user = userMap[membership.userId.toString()];
    const isExpired = new Date(membership.endDate) < now;
    const groupId = membership.groupId?.toString() || null;
    const group = groupId ? groupMap[groupId] : null;
    const name = user?.name || "Member";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return {
      id: membership.userId.toString(),
      name,
      email: user?.email || "",
      phone: user?.phone || "",
      membershipId: membership._id.toString(),
      groupId,
      groupName: group?.name || null,
      timeSlot: group?.time || null,
      court: group?.court || null,
      status: isExpired ? "expired" : membership.status || "active",
      paymentStatus: isExpired ? "due" : "paid",
      paymentDate: membership.endDate,
      joinedAt: membership.startDate,
      avatarInitials: initials || "MB",
    };
  });

  return NextResponse.json({ members });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, phone, groupId, price, plan } = body || {};

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  await connectMongoose();

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    const user =
      existingUser || (await User.create({ name, email: normalizedEmail, phone }));

    const activeMembership = await Membership.findOne({
      userId: user._id,
      status: "active",
      endDate: { $gte: new Date() },
    });

    if (activeMembership) {
      return NextResponse.json(
        { error: "Member already has an active plan" },
        { status: 409 }
      );
    }

    let group = null;
    if (groupId) {
      group = await Group.findById(groupId);
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
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);

    const membership = await Membership.create({
      userId: user._id,
      plan: plan || "cash",
      price: Number(price) || 0,
      startDate,
      endDate,
      slot: group?.time || "Unassigned",
      courtId: group?.courtId || 0,
      groupId: group?._id || null,
      status: "active",
    });

    return NextResponse.json({
      member: {
        id: user._id.toString(),
        name: user.name || "Member",
        email: user.email || "",
        membershipId: membership._id.toString(),
        groupId: group?._id?.toString() || null,
        groupName: group?.name || null,
        timeSlot: group?.time || null,
        court: group?.court || null,
        status: membership.status,
        paymentStatus: "paid",
        paymentDate: membership.endDate,
        joinedAt: membership.startDate,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to add member" }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { membershipId, name, email, phone, groupId } = body || {};

  if (!membershipId) {
    return NextResponse.json(
      { error: "Membership ID is required" },
      { status: 400 }
    );
  }

  await connectMongoose();

  const membership = await Membership.findById(membershipId);
  if (!membership) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  if (name || email || phone) {
    const update = {};
    if (name) update.name = name;
    if (email) update.email = String(email).trim().toLowerCase();
    if (phone) update.phone = phone;

    try {
      await User.findByIdAndUpdate(membership.userId, update, { new: true });
    } catch (err) {
      if (err?.code === 11000) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Unable to update member" },
        { status: 500 }
      );
    }
  }

  if (groupId !== undefined) {
    const previousGroupId = membership.groupId?.toString() || null;
    const nextGroupId = groupId || null;

    if (previousGroupId && previousGroupId !== nextGroupId) {
      await Group.findByIdAndUpdate(previousGroupId, {
        $pull: { members: membership.userId },
      });
    }

    let nextGroup = null;
    if (nextGroupId) {
      nextGroup = await Group.findById(nextGroupId);
      if (!nextGroup) {
        return NextResponse.json({ error: "Group not found" }, { status: 404 });
      }
      if (nextGroup.members.length >= nextGroup.capacity) {
        return NextResponse.json({ error: "Group is full" }, { status: 409 });
      }
      if (!nextGroup.members.some((id) => id.toString() === membership.userId.toString())) {
        nextGroup.members.push(membership.userId);
        await nextGroup.save();
      }
    }

    membership.groupId = nextGroupId;
    membership.slot = nextGroup?.time || "Unassigned";
    membership.courtId = nextGroup?.courtId || 0;
    await membership.save();
  }

  const user = await User.findById(membership.userId)
    .select("name email phone")
    .lean();
  const group = membership.groupId
    ? await Group.findById(membership.groupId).select("name court time").lean()
    : null;
  const isExpired = new Date(membership.endDate) < new Date();
  const displayName = user?.name || "Member";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return NextResponse.json({
    member: {
      id: membership.userId.toString(),
      name: displayName,
      email: user?.email || "",
      phone: user?.phone || "",
      membershipId: membership._id.toString(),
      groupId: membership.groupId?.toString() || null,
      groupName: group?.name || null,
      timeSlot: group?.time || null,
      court: group?.court || null,
      status: isExpired ? "expired" : membership.status || "active",
      paymentStatus: isExpired ? "due" : "paid",
      paymentDate: membership.endDate,
      joinedAt: membership.startDate,
      avatarInitials: initials || "MB",
    },
  });
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { membershipId } = body || {};

  if (!membershipId) {
    return NextResponse.json(
      { error: "Membership ID is required" },
      { status: 400 }
    );
  }

  await connectMongoose();

  const membership = await Membership.findByIdAndDelete(membershipId);
  if (!membership) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  if (membership.groupId) {
    await Group.findByIdAndUpdate(membership.groupId, {
      $pull: { members: membership.userId },
    });
  }

  await Group.updateMany(
    { members: membership.userId },
    { $pull: { members: membership.userId } }
  );

  return NextResponse.json({ success: true, membershipId: membership._id.toString() });
}
