import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  artwork:  { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
  title:    String,
  image:    String,
  price:    Number,
  artist:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
});

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    { type: String, default: "" },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:      [orderItemSchema],
  totalPrice: { type: Number, required: true },

  paymentMethod: {
    type: String,
    enum: ["razorpay", "cod"],
    required: true,
  },

  razorpayPaymentId: { type: String, default: null },
  address:           { type: addressSchema, required: true },

  status: {
    type: String,
    // Added "on_the_way" and "delivered" to existing statuses
    enum: ["pending", "paid", "on_the_way", "delivered", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);