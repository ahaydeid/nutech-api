import express, { json } from "express";
const app = express();

app.use(json());

app.use("/api", require("./routes/auth").default);
app.use("/api", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("Nutech API is running 🚀");
});

export default app;
