import Cart from "../models/Cart.js";
import Artwork from "../models/Artwork.js";

/* ---------- ADD TO CART ---------- */

export const addToCart = async (req, res) => {
  try {

    const { artworkId, quantity } = req.body;

    const userId = req.user._id;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({
        message: "Artwork not found"
      });
    }

    let cartItem = await Cart.findOne({
      user: userId,
      artwork: artworkId
    });

    if (cartItem) {

      cartItem.quantity += quantity || 1;

      await cartItem.save();

    } else {

      cartItem = await Cart.create({
        user: userId,
        artwork: artworkId,
        quantity: quantity || 1
      });

    }

    res.json({
      message: "Artwork added to cart",
      cartItem
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- GET USER CART ---------- */

export const getCart = async (req, res) => {
  try {

    const cart = await Cart.find({
      user: req.user._id
    })
      .populate({
        path: "artwork",
        populate: {
          path: "artist",
          select: "name"
        }
      });

    res.json(cart);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- UPDATE CART QUANTITY ---------- */

export const updateCart = async (req, res) => {
  try {

    const { quantity } = req.body;

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    if (cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    cartItem.quantity = quantity;

    await cartItem.save();

    res.json(cartItem);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- REMOVE FROM CART ---------- */

export const removeFromCart = async (req, res) => {
  try {

    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found"
      });
    }

    if (cartItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await cartItem.deleteOne();

    res.json({
      message: "Item removed from cart"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};