import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 108,
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // pastikan decoded memuat { email: ... }
    next();
  } catch (err) {
    return res.status(401).json({
      status: 108, // ⚠️ disamakan juga jadi 108
      message: "Token tidak tidak valid atau kadaluwarsa",
      data: null
    });
  }
}
