import User from "../models/User.js";

/* ---------- GET CURRENT USER PROFILE ---------- */

export const getMyProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id)
      .select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};