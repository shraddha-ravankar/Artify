import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
  createOrder,
  getUserOrders,
  getOrder,
  getArtistOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/",                protect,                                    createOrder);
router.get("/my-orders",        protect,                                    getUserOrders);
router.get("/artist-orders",    protect, authorizeRoles("artist","admin"),  getArtistOrders);
router.get("/:id",              protect,                                    getOrder);
router.put("/:id/status",       protect, authorizeRoles("artist","admin"),  updateOrderStatus);

export default router;