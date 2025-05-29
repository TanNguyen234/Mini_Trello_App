// routes/auth.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/board.controller");

router.post("/signup", controller.createBoard);

module.exports = router;