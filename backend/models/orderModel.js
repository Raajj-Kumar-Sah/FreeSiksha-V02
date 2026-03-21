import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    transaction_id: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
