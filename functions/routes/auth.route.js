// routes/auth.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const { authenticateToken } = require("../utils/auth");

router.post("/signup", controller.signUp);
router.post("/signin", controller.signIn);
router.get("/me", authenticateToken, controller.getProfile);

module.exports = router;