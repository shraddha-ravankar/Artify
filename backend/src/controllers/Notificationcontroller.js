import Notification from "../models/Notification.js";

/* ── GET MY NOTIFICATIONS ── */
export const getNotifications = async (req, res) => {
  try {
    // Support both field names: user (order notifs) and recipient (chat notifs)
    const notifications = await Notification.find({
      $or: [
        { user:      req.user._id },
        { recipient: req.user._id },
      ]
    })
      .populate("sender", "name")
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── GET UNREAD COUNT ── */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      $or: [{ user: req.user._id }, { recipient: req.user._id }],
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── MARK ALL AS READ ── */
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ user: req.user._id }, { recipient: req.user._id }], isRead: false },
      { isRead: true }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── MARK ONE AS READ ── */
export const markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};