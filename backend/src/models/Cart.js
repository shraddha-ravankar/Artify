import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true
    },

    quantity: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

/* prevent duplicate artwork in cart */

cartSchema.index({ user: 1, artwork: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;