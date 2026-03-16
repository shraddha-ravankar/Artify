

// import express from "express";
// import { register, login, logout } from "../controllers/authController.js";


// const router = express.Router();

// router.post("/register", register);
// router.post("/login",    login);
// router.post("/logout",   logout);

// export default router;



import express from "express";
import { register, login, logout } from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";
import { registerValidator, loginValidator } from "../middleware/validators.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/logout", protect, logout);

export default router;