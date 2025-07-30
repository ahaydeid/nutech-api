import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/membership.js";
import dotenv from "dotenv";
import bannerRoutes from "./routes/information.js";
import serviceRoutes from "./routes/information.js";
import transactionRoutes from "./routes/transaction.js";

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routing
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", bannerRoutes);
app.use("/", serviceRoutes);
app.use("/", transactionRoutes);

// Test route
// app.get("/", (req, res) => {
//   res.send("Nutech API is running");
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
