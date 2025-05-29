// routes/auth.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

router.post("/signup", controller.signUp);
router.post("/signin", controller.signIn);

module.exports = router;