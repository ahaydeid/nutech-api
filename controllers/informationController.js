import db from "../config/db.js";

export async function getBanner(req, res) {
  try {
    const result = await db.query("SELECT banner_name, banner_image, description FROM banners");

    res.status(200).json({
      status: 0,
      message: "Sukses",
      data: result.rows
    });
  } catch (err) {
    console.error("Get banner error:", err);
    res.status(500).json({
      status: 1,
      message: "Terjadi kesalahan saat mengambil banner",
      data: null
    });
  }
}

export async function getServices(req, res) {
  try {
    const result = await db.query(
      "SELECT service_code, service_name, service_icon, service_tariff FROM services"
    );

    return res.status(200).json({
      status: 0,
      message: "Sukses",
      data: result.rows
    });
  } catch (err) {
    console.error("Get services error:", err);
    return res.status(500).json({
      status: 1,
      message: "Gagal mengambil data layanan",
      data: null
    });
  }
}