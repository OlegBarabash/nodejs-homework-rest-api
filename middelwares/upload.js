import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cd) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniquePrefix}_${file.originalname}`;
    cd(null, fileName);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") {
    return cb(HttpError(400, "Invalid file extension"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;