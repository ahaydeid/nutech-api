import db from "../config/db.js";

export async function getProfile(req, res) {
  try {
    const result = await db.query("SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1", [req.user.email]);

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        status: 108,
        message: "Token tidak tidak valid atau kadaluwarsa",
        data: null,
      });
    }
    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: user,
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan saat mengambil profil",
      data: null,
    });
  }
}

export async function updateProfile(req, res) {
  const { first_name, last_name } = req.body;
  const email = req.user.email;

  try {
    await db.query("UPDATE users SET first_name = $1, last_name = $2 WHERE email = $3", [first_name, last_name, email]);

    const updatedUser = await db.query("SELECT email, first_name, last_name FROM users WHERE email = $1", [email]);

    res.json({
      status: 0,
      message: "Update Pofile berhasil",
      data: {
        ...updatedUser.rows[0],
        profile_image: "https://yoururlapi.com/profile.jpeg",
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(401).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null,
    });
  }
}

export async function uploadProfileImage(req, res) {
  const email = req.user.email;

  if (!req.file) {
    return res.status(400).json({
      status: 102,
      message: "Format Image tidak sesuai",
      data: null,
    });
  }

  const imageUrl = `https://yoururlapi.com/uploads/${req.file.filename}`;

  try {
    await db.query("UPDATE users SET profile_image = $1 WHERE email = $2", [imageUrl, req.user.email]);

    const result = await db.query("SELECT email, first_name, last_name FROM users WHERE email = $1", [email]);

    const user = result.rows[0];

    return res.status(200).json({
      status: 0,
      message: "Update Profile Image berhasil",
      data: {
        ...user,
        profile_image: imageUrl,
      },
    });
  } catch (err) {
    console.error("Upload image error:", err);
    return res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan saat upload image",
      data: null,
    });
  }
}
