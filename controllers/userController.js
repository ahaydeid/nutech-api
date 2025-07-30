import db from "../config/db.js";
// import { v4 as uuidv4 } from "uuid";


export async function getProfile(req, res) {
  try {
    const result = await db.query(
      "SELECT email, first_name, last_name FROM users WHERE email = $1",
      [req.user.email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: {
        ...user,
        profile_image: "https://yoururlapi.com/profile.jpeg"
      }
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan saat mengambil profil",
      data: null
    });
  }
}

export async function updateProfile(req, res) {
  const { first_name, last_name } = req.body;
  const email = req.user.email;

  try {
      await db.query(
        'UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3',
        [first_name, last_name, email]
      );

      const updatedUser = await db.query(
        'SELECT email, first_name, last_name FROM users WHERE email = $1',
        [email]
      );

    res.json({
      status: 0,
      message: "Update Pofile berhasil",
      data: {
        ...updatedUser.rows[0],
        profile_image: "https://yoururlapi.com/profile.jpeg"
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(401).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null
    });
  }
}

export async function getBalance(req, res) {
  try {
    const result = await db.query('SELECT balance FROM users WHERE id = $1', [req.user.id]);
    res.json({ balance: result.rows[0].balance });
  } catch {
    res.status(500).json({ message: 'Error getting balance' });
  }
}

export async function topUp(req, res) {
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
}

export async function getTransactions(req, res) {
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
}
