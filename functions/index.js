const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("./utils/firebaseAdmin");

const route = require("./routes/index.route")
const authRoute = require("./routes/auth.route")

require("dotenv").config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware xác thực
app.use("/auth", authRoute)
const { authenticateToken } = require("./utils/auth");

app.use(authenticateToken);

// Routes
route(app)

exports.api = functions.https.onRequest(app);