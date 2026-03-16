import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  likeArtwork,
  unlikeArtwork,
  getLikedArtworks
} from "../controllers/likeController.js";

const router = express.Router();

/* Like artwork */

router.post("/:artworkId", protect, likeArtwork);

/* Unlike artwork */

router.delete("/:artworkId", protect, unlikeArtwork);

/* Get liked artworks */

router.get("/user/likes", protect, getLikedArtworks);

export default router;