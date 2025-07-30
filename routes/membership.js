import express from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";
import { getProfile, updateProfile, uploadProfileImage } from "../controllers/membershipController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${req.user.email}.${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage, fileFilter });

router.get("/profile", verifyToken, getProfile);
router.put("/profile/update", verifyToken, updateProfile);
router.put("/profile/image", verifyToken, upload.single("file"), uploadProfileImage);

export default router;
