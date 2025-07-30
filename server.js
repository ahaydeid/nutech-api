import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware biar req.body bisa terbaca
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
app.use("/", authRoutes);
app.use("/", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Nutech API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
