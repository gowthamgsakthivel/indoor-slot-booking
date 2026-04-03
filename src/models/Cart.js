import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateLabel: { type: String },
    court: { type: String },
    slot: { type: String },
    duration: { type: String },
    amount: { type: Number, default: 0 },
    members: { type: Number, default: 1 },
    timeSlots: { type: [Number], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
