const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware xác thực
const { authenticateToken } = require("./utils/auth");
app.use(authenticateToken);

// Routes
app.use("/auth", require("./routes/auth"));

exports.api = functions.https.onRequest(app);