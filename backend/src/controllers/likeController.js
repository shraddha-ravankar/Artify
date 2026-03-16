import Like from "../models/Like.js";
import Artwork from "../models/Artwork.js";

/* ---------- LIKE ARTWORK ---------- */

export const likeArtwork = async (req, res) => {
  try {

    const artworkId = req.params.artworkId;
    const userId = req.user._id;

    const existingLike = await Like.findOne({
      user: userId,
      artwork: artworkId
    });

    if (existingLike) {
      return res.status(400).json({
        message: "Artwork already liked"
      });
    }

    await Like.create({
      user: userId,
      artwork: artworkId
    });

    /* Increase like count */

    await Artwork.findByIdAndUpdate(
      artworkId,
      { $inc: { likes: 1 } }
    );

    res.json({
      message: "Artwork liked successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- UNLIKE ARTWORK ---------- */

export const unlikeArtwork = async (req, res) => {
  try {

    const artworkId = req.params.artworkId;
    const userId = req.user._id;

    const like = await Like.findOne({
      user: userId,
      artwork: artworkId
    });

    if (!like) {
      return res.status(404).json({
        message: "Like not found"
      });
    }

    await like.deleteOne();

    await Artwork.findByIdAndUpdate(
      artworkId,
      { $inc: { likes: -1 } }
    );

    res.json({
      message: "Artwork unliked"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ---------- GET USER LIKED ARTWORKS ---------- */

export const getLikedArtworks = async (req, res) => {
  try {

    const likes = await Like.find({ user: req.user._id })
      .populate({
        path: "artwork",
        populate: {
          path: "artist",
          select: "name"
        }
      });

    const artworks = likes.map(like => like.artwork);

    res.json(artworks);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};