import multer from "multer";

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/docs"),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

export default upload;
