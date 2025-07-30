import db from "../config/db.js";

export async function getBalance(req, res) {
  try {
    const result = await db.query(
      "SELECT balance FROM users WHERE email = $1",
      [req.user.email]
    );

    const balance = result.rows[0]?.balance;

    if (balance === undefined) {
      return res.status(404).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: "Get Balance Berhasil",
      data: {
        balance
      }
    });
  } catch (err) {
    console.error("Get balance error:", err);
    return res.status(500).json({
      status: 1,
      message: "Gagal mengambil saldo",
      data: null
    });
  }
}


export async function topUp(req, res) {
  const { top_up_amount } = req.body;

  // Validasi: hanya angka dan > 0
  if (typeof top_up_amount !== "number" || top_up_amount <= 0) {
    return res.status(400).json({
      status: 102,
      message: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0",
      data: null
    });
  }

  try {
    const userResult = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [req.user.email]
    );

    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({
        status: 108,
        message: "User tidak ditemukan",
        data: null
      });
    }

    await db.query("BEGIN");

    // Update saldo user
    await db.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2",
      [top_up_amount, userId]
    );

    // Generate nomor invoice
    const invoiceNumber = `INV-${Date.now()}`;

    // Masukkan ke tabel transaksi
    await db.query(
      `INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'TOPUP', 'Top Up Saldo', $3)`,
      [userId, invoiceNumber, top_up_amount]
    );

    // Ambil saldo terbaru
    const balanceResult = await db.query(
      "SELECT balance FROM users WHERE id = $1",
      [userId]
    );

    await db.query("COMMIT");

    return res.status(200).json({
      status: 0,
      message: "Top Up Balance berhasil",
      data: {
        balance: balanceResult.rows[0].balance
      }
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Top up error:", err.message);
    return res.status(500).json({
      status: 1,
      message: "Top up gagal",
      data: null
    });
  }
}


export async function createTransaction(req, res) {
  const email = req.user.email;
  const { service_code } = req.body;

  try {
    // Ambil data service dari kode
    const serviceRes = await db.query(
      "SELECT * FROM services WHERE service_code = $1",
      [service_code]
    );

    const service = serviceRes.rows[0];

    if (!service) {
      return res.status(400).json({
        status: 102,
        message: "Service atau Layanan tidak ditemukan",
        data: null,
      });
    }

    // Cek user dan saldo
    const userRes = await db.query("SELECT id, balance FROM users WHERE email = $1", [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({
        status: 104,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    if (user.balance < service.service_tariff) {
      return res.status(400).json({
        status: 103,
        message: "Saldo tidak mencukupi",
        data: null,
      });
    }

    const now = new Date();
    const invoice_number = `INV${now.getTime()}`;

    await db.query("BEGIN");

    // Kurangi saldo user
    await db.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [service.service_tariff, user.id]
    );

    // Simpan transaksi pakai user_id
    await db.query(
      `INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount)
       VALUES ($1, $2, 'PAYMENT', $3, $4)`,
      [user.id, invoice_number, service.service_name, service.service_tariff]
    );

    await db.query("COMMIT");

    return res.status(200).json({
      status: 0,
      message: "Transaksi berhasil",
      data: {
        invoice_number,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: "PAYMENT",
        total_amount: service.service_tariff,
        created_on: now.toISOString(),
      },
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Transaction error:", err);
    return res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan saat transaksi",
      data: null,
    });
  }
}


export async function getTransactionHistory(req, res) {
  const { offset = 0, limit } = req.query;

  try {
    // Ambil ID user dari email di payload JWT
    const userResult = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [req.user.email]
    );
    const userId = userResult.rows[0]?.id;

    if (!userId) {
      return res.status(404).json({
        status: 1,
        message: "User tidak ditemukan",
        data: null
      });
    }

    // Query untuk ambil data history transaksi
    let query = `SELECT invoice_number, transaction_type, description, total_amount, created_at as created_on 
                 FROM transactions 
                 WHERE user_id = $1 
                 ORDER BY created_at DESC`;

    // Tambahkan limit & offset jika limit tersedia
    const params = [userId];
    if (limit) {
      query += ` LIMIT $2 OFFSET $3`;
      params.push(Number(limit), Number(offset));
    }

    const result = await db.query(query, params);

    return res.status(200).json({
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: Number(offset),
        limit: limit ? Number(limit) : null,
        records: result.rows
      }
    });

  } catch (error) {
    console.error("Error getTransactionHistory:", error.message);
    return res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan pada server",
      data: null
    });
  }
}