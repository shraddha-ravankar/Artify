import multer from "multer";

// Use memory storage — file goes directly to buffer, no disk needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    var allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowed.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, webp images are allowed"), false);
    }
  },
});

export default upload;