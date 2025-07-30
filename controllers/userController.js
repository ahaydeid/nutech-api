const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getBalance = async (req, res) => {
  try {
    const result = await db.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    res.json({ balance: result.rows[0].balance });
  } catch {
    res.status(500).json({ message: 'Error getting balance' });
  }
};

exports.topUp = async (req, res) => {
  const { top_up_amount } = req.body;
  try {
    const invoice = `INV-${Date.now()}`;
    await db.query('BEGIN');
    await db.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [top_up_amount, req.user.id]);
    await db.query(
      `INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'TOPUP', 'Top Up Saldo', $3)`,
      [req.user.id, invoice, top_up_amount]
    );
    await db.query('COMMIT');
    res.json({ message: 'Top up success', invoice });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ message: 'Top up failed' });
  }
};

exports.getTransactions = async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;
  try {
    const result = await db.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3',
      [req.user.id, offset, limit]
    );
    res.json({ transactions: result.rows });
  } catch {
    res.status(500).json({ message: 'Error getting transactions' });
  }
};
