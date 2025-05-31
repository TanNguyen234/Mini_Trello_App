const express = require("express");
const router = express.Router();

const controller = require("../controllers/board.controller");

router.get("/", controller.getBoards);
router.post("/", controller.createBoard);
router.get("/:id", controller.getBoardById);
router.put("/:id", controller.updateBoard);
router.delete("/:id", controller.deleteBoard);

module.exports = router;