import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  artwork:  { type: mongoose.Schema.Types.ObjectId, ref: "Artwork", required: true },
  sender:   { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  message:  { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);