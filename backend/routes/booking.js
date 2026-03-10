const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const db = require("../db");

const OWNER_EMAILS = ["epr@ecoreco.com", "info@ecoreco.com"];

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER || "", pass: process.env.SMTP_PASS || "" },
});

// POST /api/booking — receive pickup request, store in DB, email owner
router.post("/", async (req, res) => {
  try {
    const { name, phone, location, items, otherElectronics, quantity, notes } = req.body;

    // Validation
    if (!name || !phone || !location || !items || !Array.isArray(items) || items.length === 0 || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const itemsText = items.join(", ") + (otherElectronics ? ` (Other: ${otherElectronics})` : "");

    // Store in database
    await db.query(
      "INSERT INTO bookings (name, phone, location, items, other_electronics, quantity, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, phone, location, itemsText, otherElectronics || null, quantity, notes || null]
    );

    // Send email to owner
    const emailHtml = `
      <h2>🔔 New E-Waste Pickup Request</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Location</td><td style="padding:8px;border:1px solid #ddd;">${location}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Items</td><td style="padding:8px;border:1px solid #ddd;">${itemsText}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Quantity</td><td style="padding:8px;border:1px solid #ddd;">${quantity}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Notes</td><td style="padding:8px;border:1px solid #ddd;">${notes || "N/A"}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;">Submitted on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
    `;

    for (const to of OWNER_EMAILS) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || "noreply@bookmyjunk.com",
          to,
          subject: `New Pickup Request from ${name} — ${location}`,
          html: emailHtml,
        });
      } catch (e) {
        console.error(`[Booking Email] Failed to send to ${to}:`, e.message);
      }
    }

    console.log(`[Booking] New request from ${name} (${phone}) — ${location}`);
    res.status(201).json({ message: "Booking submitted successfully" });
  } catch (err) {
    console.error("[Booking] Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/booking — list all bookings (admin only, uses auth middleware externally)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
