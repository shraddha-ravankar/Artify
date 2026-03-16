import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  // orderController uses: { user, type, message, ref }
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // chatController uses: { recipient, sender, type, title, body, link }
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type:    { type: String, enum: ["new_message", "new_order", "order_update"], required: true },

  // orderController fields
  message: { type: String, default: "" },
  ref:     { type: mongoose.Schema.Types.ObjectId, default: null },

  // chatController fields
  title:   { type: String, default: "" },
  body:    { type: String, default: "" },
  link:    { type: String, default: "" },

  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);