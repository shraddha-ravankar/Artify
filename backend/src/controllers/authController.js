
import User from "../models/User.js";
import jwt from "jsonwebtoken";

/* ── helpers ── */
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const userShape = (user) => ({
  id:    user._id,
  name:  user.name,
  email: user.email,
  role:  user.role,
});

/* ──────────── REGISTER ──────────── */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const allowedRoles = ["user", "artist"];
    const safeRole = allowedRoles.includes(role) ? role : "user";

    // User model hashes password via pre-save hook
    const user = await User.create({
      name:     name.trim(),
      email:    email.toLowerCase().trim(),
      password,
      role:     safeRole,
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: userShape(user),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

/* ──────────── LOGIN ──────────── */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken(user);

    res.json({
      token,
      user: userShape(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

/* ──────────── LOGOUT ──────────── */
export const logout = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};