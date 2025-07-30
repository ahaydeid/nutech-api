// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth").default;
// const { getBalance, topUp, getTransactions } = require("../controllers/userController");

// router.get("/balance", auth, getBalance);
// router.post("/topup", auth, topUp);
// router.get("/transaction/history", auth, getTransactions);

// module.exports = router;


// routes/user.js
import express from 'express';
import { getBalance, topUp, getTransactionHistory } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/balance', auth, getBalance);
router.post('/topup', auth, topUp);
router.get('/transaction/history', auth, getTransactionHistory);

export default router;
