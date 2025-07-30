import db from '../config/db.js';
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const { sign } = jwt;

export async function register(req, res) {
  const { email, first_name, last_name, password } = req.body;

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 102,
      message: "Paramter email tidak sesuai format",
      data: null
    });
  }

  // Validasi panjang password
  if (!password || password.length < 8) {
    return res.status(400).json({
      status: 1,
      message: "Password minimal 8 karakter",
      data: null
    });
  }

  const hashed = await hash(password, 10);
  const defaultProfileImage = "https://yoururlapi.com/profile.jpeg";
  const defaultBalance = 1000000;

  try {
    await db.query(
      `INSERT INTO users (email, first_name, last_name, password, profile_image, balance)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, first_name, last_name, hashed, defaultProfileImage, defaultBalance]
    );

    return res.status(200).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      status: 1,
      message: err.detail || "Terjadi kesalahan saat registrasi",
      data: null
    });
  }
}


export async function login(req, res) {
  const { email, password } = req.body;

  // Validasi Format Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 102,
      message: "Paramter email tidak sesuai format",
      data: null
    });
  }

  // Validasi panjang password
  if (password.length < 8) {
    return res.status(400).json({
      status: 102,
      message: "Password minimal 8 karakter",
      data: null
    });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    const match = await compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        status: 1,
        message: "Username atau password salah",
        data: null
      });
    }

    const token = sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return res.status(200).json({
      status: 0,
      message: "Login Sukses",
      data: { token }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan saat login",
      data: null
    });
  }
}
