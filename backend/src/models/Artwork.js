import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
   

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    image: {
      type: String,
      required: true
    },
     type: {
  type: String,
  enum: ["painting","photography","drawing"],
  required: true
},
    cloudinaryId: {
    type: String
  },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    likes: {
      type: Number,
      default: 0
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;