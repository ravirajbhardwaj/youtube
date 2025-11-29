import multer from "multer";
import { randomBytes } from "crypto";
import { ApiError } from "@/utils/ApiError";

const storage = multer.diskStorage({
  destination: function (_, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = `${Date.now()}-${randomBytes(16).toString("hex")}`;
    const prefix = "pfp";
    cb(null, `${prefix}${file.fieldname}${uniqueSuffix}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fieldSize: 100,
    fileSize: 2 * 1024 * 1024, // 2MB
    headerPairs: 1000,
  },
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      return cb(new ApiError(500, "Invalid mime type"));
    }
  },
});