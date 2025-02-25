import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    orderedCourse: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "course is required"],
    },

    price: {
      type: Number,
    },

    address: {
      type: String,
    },

    paymentType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    payedAt: Date,
    isDeliverd: {
      type: Boolean,
      default: false,
    },
    deliverdAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
