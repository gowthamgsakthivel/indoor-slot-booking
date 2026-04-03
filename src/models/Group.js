import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    court: { type: String },
    time: { type: String },
    maxMembers: { type: Number, default: 6 },
    level: { type: String },
    createdAt: { type: Date, default: Date.now },
    courtId: { type: Number, required: true },
    slot: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    capacity: { type: Number, default: 6 },
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model("Group", GroupSchema);
