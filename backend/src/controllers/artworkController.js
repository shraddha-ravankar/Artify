import Artwork    from "../models/Artwork.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Upload buffer to Cloudinary using Node built-in Readable stream — no extra packages
const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "artworks" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/* ── CREATE ── */
export const createArtwork = async (req, res) => {
  try {
    

    if (!req.file) {
      return res.status(400).json({ message: "Artwork image is required" });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);

    const artwork = await Artwork.create({
      title:        req.body.title,
      description:  req.body.description,
      price:        req.body.price,
      type:         req.body.type || "",
      isFeatured:   req.body.isFeatured === "true" || req.body.isFeatured === true,
      image:        result.secure_url,
      cloudinaryId: result.public_id,
      artist:       req.user._id,
    });

    res.status(201).json({ message: "Artwork uploaded successfully", artwork });
  } catch (error) {
    console.error("createArtwork error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ALL ── */
export const getAllArtworks = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 12;
    const sort   = req.query.sort || "newest";
    const skip   = (page - 1) * limit;

    const filter = { title: { $regex: search, $options: "i" } };
    if (req.query.isFeatured) filter.isFeatured = true;
    if (req.query.type)       filter.type = req.query.type;

    let sortOption = { createdAt: -1 };
    if (sort === "price_low")  sortOption = { price:  1 };
    if (sort === "price_high") sortOption = { price: -1 };

    const total    = await Artwork.countDocuments(filter);
    const artworks = await Artwork.find(filter)
      .sort(sortOption).skip(skip).limit(limit)
      .populate("artist", "name email");

    res.json({ total, page, pages: Math.ceil(total / limit), artworks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── GET ONE ── */
export const getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate("artist", "name email");
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    res.json(artwork);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── GET MY ARTWORKS ── */
export const getMyArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user._id }).sort({ createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── UPDATE ── */
export const updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    if (artwork.artist.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (req.body.title)       artwork.title       = req.body.title;
    if (req.body.description) artwork.description = req.body.description;
    if (req.body.price)       artwork.price       = req.body.price;
    if (req.body.type)        artwork.type        = req.body.type;
    if (req.body.isFeatured !== undefined)
      artwork.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;

    if (req.file) {
      if (artwork.cloudinaryId)
        await cloudinary.uploader.destroy(artwork.cloudinaryId);
      const result         = await uploadBufferToCloudinary(req.file.buffer);
      artwork.image        = result.secure_url;
      artwork.cloudinaryId = result.public_id;
    }

    await artwork.save();
    res.json({ message: "Artwork updated", artwork });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ── DELETE ── */
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    if (artwork.artist.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    if (artwork.cloudinaryId)
      await cloudinary.uploader.destroy(artwork.cloudinaryId);
    await artwork.deleteOne();
    res.json({ message: "Artwork deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};