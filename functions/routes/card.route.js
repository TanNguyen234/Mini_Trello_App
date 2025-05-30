const express = require("express");
const router = express.Router();

const controller = require("../controllers/card.controller");

router.get("/cards", controller.getCards);
router.post("/cards", controller.createCard);
router.get("/cards/:id", controller.getCardById);
router.get("/cards/user/:user_id", controller.getCardByUser);
router.put("/cards/:id", controller.updateCard);
router.delete("/:id", controller.deleteBoard);

router.post("invite", controller.inviteToBoard);
router.post("/cards/:id/invite/accept", controller.acceptCardInvite);

module.exports = router;
