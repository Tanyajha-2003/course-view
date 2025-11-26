import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

  orderId: String,
  paymentId: String,
  signature: String,
  amount: Number,
  currency: String,

  status: { type: String, default: "SUCCESS" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", PaymentSchema);
