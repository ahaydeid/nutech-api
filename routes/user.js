const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getBalance, topUp, getTransactions } = require('../controllers/userController');

router.get('/balance', auth, getBalance);
router.post('/topup', auth, topUp);
router.get('/transaction/history', auth, getTransactions);

module.exports = router;
