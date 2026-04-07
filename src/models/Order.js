import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    baseAmount: { type: Number },
    serviceFee: { type: Number },
    tax: { type: Number },
    currency: { type: String, default: "INR" },
    court: { type: String },
    slot: { type: String },
    duration: { type: String },
    members: { type: Number, default: 1 },
    status: { type: String, default: "Confirmed" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
