import dotenv from "dotenv";
dotenv.config();

console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

import express from "express";
import mongoose from "mongoose";

import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import authRouter from "./routes/auth.js";

const app = express();

// Middleware
app.use(express.json());

// ENV variables
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoppyglobe";

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start server ONLY after DB connection
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});
