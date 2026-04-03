import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    slot: { type: String, required: true },
    courtId: { type: Number, required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Membership ||
  mongoose.model("Membership", MembershipSchema);
