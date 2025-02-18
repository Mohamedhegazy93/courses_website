import multer from "multer";
import ApiError from "../utils/apiError.js";
import path from "path";
//-------------------------------------------------------------------------\\
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
//-------------------------------------------------------------------------\\
const multerFilterFiles = function (req, file, cb) {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images or videos can uploaded", 400), false);
  }
};
//-------------------------------------------------------------------------\\

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: multerFilterFiles,
});



