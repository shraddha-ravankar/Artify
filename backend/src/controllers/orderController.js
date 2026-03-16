import Order from "../models/Order.js";
import Cart  from "../models/Cart.js";

/* ── notify artist (non-blocking) ── */
const saveNotification = async (artistId, message, orderId) => {
  try {
    const { default: Notification } = await import("../models/Notification.js");
    await Notification.create({
      user:    artistId,
      type:    "new_order",
      message: message,
      ref:     orderId,
      isRead:  false,
    });
  } catch (err) {
    console.error("Notification error:", err.message);
  }
};

/* ── CREATE ORDER ── */
export const createOrder = async (req, res) => {
  try {
    const { cartItemIds, address, paymentMethod } = req.body;

    const allCartItems = await Cart.find({ user: req.user._id }).populate({
      path: "artwork",
      populate: { path: "artist", select: "name _id" },
    });

    if (!allCartItems.length)
      return res.status(400).json({ message: "Your cart is empty" });

    let filtered;
    if (cartItemIds && cartItemIds.length) {
      const idSet = new Set(cartItemIds.map(String));
      filtered = allCartItems.filter(ci => idSet.has(String(ci._id)));
    } else {
      filtered = allCartItems;
    }

    if (!filtered.length)
      return res.status(400).json({ message: "Selected cart items not found" });

    if (!address || !address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode)
      return res.status(400).json({ message: "Delivery address is incomplete" });

    if (!["razorpay", "cod"].includes(paymentMethod))
      return res.status(400).json({ message: "Invalid payment method" });

    const orderItems = filtered.map(ci => ({
      artwork:  ci.artwork._id,
      title:    ci.artwork.title,
      image:    ci.artwork.image  || "",
      price:    ci.artwork.price  || 0,
      artist:   ci.artwork.artist ? ci.artwork.artist._id : null,
      quantity: ci.quantity,
    }));

    const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      paymentMethod,
      address,
      status: "pending",
    });

    await Cart.deleteMany({
      user:    req.user._id,
      artwork: { $in: filtered.map(ci => ci.artwork._id) },
    });

    // Notify each unique artist
    const artistIds = [...new Set(
      orderItems.filter(i => i.artist).map(i => String(i.artist))
    )];

    for (const aId of artistIds) {
      await saveNotification(
        aId,
        `New order received — ₹${totalPrice.toLocaleString("en-IN")} from ${req.user.name || "a buyer"}`,
        order._id
      );
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── GET USER ORDERS ── */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.artwork", "title image")
      .populate("items.artist",  "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── GET SINGLE ORDER ── */
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.artwork", "title image price")
      .populate("items.artist",  "name");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (String(order.user) !== String(req.user._id))
      return res.status(403).json({ message: "Not authorized" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── GET ORDERS FOR ARTIST (orders containing artist's artworks) ── */
export const getArtistOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "items.artist": req.user._id })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.artwork", "title image");

    // Filter items to only this artist's items
    const filtered = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(i => i.artist && String(i.artist) === String(req.user._id)),
    }));

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── UPDATE ORDER STATUS (artist marks as completed/cancelled) ── */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "paid", "on_the_way", "delivered", "cancelled"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check this artist has items in this order
    const hasItem = order.items.some(i => i.artist && String(i.artist) === String(req.user._id));
    if (!hasItem)
      return res.status(403).json({ message: "Not authorized" });

    order.status = status;
    await order.save();

    // Notify buyer of status update
    try {
      const { default: Notification } = await import("../models/Notification.js");
      await Notification.create({
        user:    order.user,
        type:    "order_update",
        message: `Your order status has been updated to: ${status}`,
        ref:     order._id,
        isRead:  false,
      });
    } catch (e) {}

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};