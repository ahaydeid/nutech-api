import express from "express";
import { getBalance, topUp, createTransaction, getTransactionHistory } from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/balance", verifyToken, getBalance);
router.post("/topup", verifyToken, topUp);
router.post("/transaction", verifyToken, createTransaction);
router.get("/transaction/history", verifyToken, getTransactionHistory);

export default router;