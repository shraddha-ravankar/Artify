import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";


import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import artworkRoutes from "./src/routes/artworkRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

import { notFound, errorHandler} from "./src/middleware/errorMiddleware.js";



const app = express();



/* ---------- Database ---------- */

connectDB();

/* ---------- Middleware ---------- */

app.use(cors());
app.use(express.json());




/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/artworks", artworkRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);




/* ---------------- ERRORS ---------------- */
app.use(notFound);
app.use(errorHandler);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", time: new Date() })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message || "Server Error" });
});

/* ---------- Test Route ---------- */

app.get("/", (req, res) => {
  res.json({
    message: "Art Gallery API running",
  });
});

/* ---------- Server ---------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});