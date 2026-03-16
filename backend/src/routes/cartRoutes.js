import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
} from "../controllers/cartController.js";

const router = express.Router();

/* add item */

router.post("/", protect, addToCart);

/* get cart */

router.get("/", protect, getCart);

/* update quantity */

router.put("/:id", protect, updateCart);

/* remove item */

router.delete("/:id", protect, removeFromCart);

export default router;