const express = require("express");
const controller = require("../controllers/githubAttachment.controller");

const router = express.Router();

router.post("/github-attach", controller.attachGitHubToTask);

router.get("/github-attachments", controller.getTaskAttachments);

router.delete("/github-attachments/:attachmentId", controller.removeAttachment);

module.exports = router;