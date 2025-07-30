import express, { json } from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

const app = express();

app.use(json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Nutech API is running");
});

export default app;
