import express        from "express";
import { protect }    from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload         from "../utils/upload.js";
import {
  createArtwork,
  getAllArtworks,
  getArtwork,
  updateArtwork,
  deleteArtwork,
  getMyArtworks,
} from "../controllers/artworkController.js";

const router = express.Router();

/* ── PUBLIC ─────────────────────────────── */
router.get("/", getAllArtworks);

/*
  CRITICAL: /my-artworks MUST be before /:id
  Otherwise Express treats "my-artworks" as an :id param → 404
*/
router.get(
  "/my-artworks",
  protect,
  authorizeRoles("artist", "admin"),
  getMyArtworks
);

router.get("/:id", getArtwork);

/* ── ARTIST ONLY ────────────────────────── */
router.post(
  "/",
  protect,
  authorizeRoles("artist", "admin"),
  upload.single("image"),
  createArtwork
);

router.put(
  "/:id",
  protect,
  authorizeRoles("artist", "admin"),
  upload.single("image"),
  updateArtwork
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("artist", "admin"),
  deleteArtwork
);

export default router;