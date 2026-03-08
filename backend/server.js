require("dotenv").config();
const express = require("express");
const cors = require("cors");
const blogRoutes = require("./routes/blog");
const adminRoutes = require("./routes/admin");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Blog API running on port ${PORT}`);
});
