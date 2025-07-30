import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getBalance, topUp, getTransactions, getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile/update", verifyToken, updateProfile);

export default router;
