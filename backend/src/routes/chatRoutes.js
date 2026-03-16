import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendMessage, getConversation, getUserChats } from "../controllers/chatController.js";

const router = express.Router();

router.post("/",                      protect, sendMessage);
router.get("/:artworkId/:userId",     protect, getConversation);
router.get("/",                       protect, getUserChats);

export default router;