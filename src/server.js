import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// ROUTES
import authRouter from "./routes/auth.js";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shoppyglobe";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error: ", err);
    process.exit(1);
  });

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

// PROTECTED TEST ROUTE
import auth from "./middleware/authMiddleware.js";
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "Protected OK", user: req.user });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
