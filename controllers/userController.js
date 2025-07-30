import { query } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

export async function getBalance(req, res) {
  try {
    const result = await query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    res.json({ balance: result.rows[0].balance });
  } catch {
    res.status(500).json({ message: 'Error getting balance' });
  }
}

export async function topUp(req, res) {
  const { top_up_amount } = req.body;
  try {
    const invoice = `INV-${Date.now()}`;
    await query('BEGIN');
    await query('UPDATE users SET balance = balance + $1 WHERE id = $2', [top_up_amount, req.user.id]);
    await query(
      `INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'TOPUP', 'Top Up Saldo', $3)`,
      [req.user.id, invoice, top_up_amount]
    );
    await query('COMMIT');
    res.json({ message: 'Top up success', invoice });
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ message: 'Top up failed' });
  }
}

export async function getTransactions(req, res) {
  const { offset = 0, limit = 10 } = req.query;
  try {
    const result = await query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3',
      [req.user.id, offset, limit]
    );
    res.json({ transactions: result.rows });
  } catch {
    res.status(500).json({ message: 'Error getting transactions' });
  }
}
