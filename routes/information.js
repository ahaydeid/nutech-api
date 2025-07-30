import express from "express";
import { getBanner, getServices } from "../controllers/informationController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/banner", getBanner);
router.get("/services", verifyToken, getServices);

export default router;
