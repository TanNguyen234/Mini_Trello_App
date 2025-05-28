// routes/auth.js
const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const transporter = require("../utils/mailer");

router.post("/signup", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random()*900000).toString();
  await db.collection("emailCodes").doc(email).set({ code, createdAt: Date.now() });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Your verification code",
    text: `Your code: ${code}`,
  });
  res.send("Code sent");
});

module.exports = router;