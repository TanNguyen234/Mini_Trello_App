const express = require("express");
const controller = require("../controllers/task.controller");

const router = express.Router();

router.get("/", controller.getTasksByCard);
router.post("/", controller.createTask);
router.get("/:taskId", controller.getTaskDetails);
router.put("/:taskId", controller.updateTask);
router.delete("/:taskId", controller.deleteTask);
router.post("/:taskId/assign", controller.assignMember);
router.get("/:taskId/assign", controller.getAssignedMembers);
router.delete("/:taskId/assign/:memberId", controller.removeAssignedMember);

module.exports = router;