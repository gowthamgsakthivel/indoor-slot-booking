import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dob: { type: String },
    address: { type: String },
  },
  { timestamps: true, collection: "users" }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
