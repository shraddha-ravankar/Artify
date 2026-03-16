import Message      from "../models/Message.js";
import Artwork      from "../models/Artwork.js";
import Notification from "../models/Notification.js";

/* ── SEND MESSAGE ──
   Works for BOTH directions:
   - User → Artist: provide artworkId, receiverId = artwork.artist
   - Artist → User: provide artworkId + receiverId explicitly
*/
export const sendMessage = async (req, res) => {
  try {
    const { artworkId, message, receiverId: explicitReceiverId } = req.body;

    const artwork = await Artwork.findById(artworkId).populate("artist", "name");
    if (!artwork)
      return res.status(404).json({ message: "Artwork not found" });

    // If artist is replying, they pass receiverId explicitly
    // If user is messaging, receiver = artwork.artist
    let receiverId;
    if (explicitReceiverId) {
      receiverId = explicitReceiverId;
    } else {
      receiverId = artwork.artist._id;
    }

    if (receiverId.toString() === req.user._id.toString())
      return res.status(400).json({ message: "Cannot message yourself" });

    const newMessage = await Message.create({
      artwork:  artworkId,
      sender:   req.user._id,
      receiver: receiverId,
      message,
    });

    // Notify receiver
    await Notification.create({
      recipient: receiverId,
      sender:    req.user._id,
      type:      "new_message",
      title:     "New Message",
      body:      req.user.name + ' sent you a message about "' + artwork.title + '"',
      link:      "/chat",
    });

    const populated = await Message.findById(newMessage._id)
      .populate("sender",   "name role")
      .populate("receiver", "name role");

    res.status(201).json({ message: "Message sent", data: populated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── GET CONVERSATION ── */
export const getConversation = async (req, res) => {
  try {
    const { artworkId, userId } = req.params;
    const messages = await Message.find({
      artwork: artworkId,
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId,       receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender",   "name role")
      .populate("receiver", "name role");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ── GET ALL USER CHATS (grouped — latest per conversation) ── */
export const getUserChats = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("artwork",  "title image")
      .populate("sender",   "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: -1 });

    // One entry per artwork+partner pair
    const seen  = {};
    const chats = [];
    messages.forEach(function(m) {
      if (!m.artwork) return;
      var otherId = m.sender._id.toString() === req.user._id.toString()
        ? m.receiver._id.toString()
        : m.sender._id.toString();
      var key = m.artwork._id.toString() + "_" + otherId;
      if (!seen[key]) { seen[key] = true; chats.push(m); }
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};